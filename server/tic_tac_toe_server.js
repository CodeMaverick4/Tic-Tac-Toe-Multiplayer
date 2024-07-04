const express = require('express');
const app = express();
const server = require('http').createServer(app);
const checkWin = require('./checking_win _condition')
const path = require('path');
const io = require('socket.io')(server,{
    cors:{
        'origin':"*",
    }
});

// Array.from({length:num},()=> Array(num).fill(''))

let user_lis = {};
let user_move_counts = {};

io.on('connection',(socket)=>{
    console.log("user connected with server");
    // initailizing matrix
    const matrix = Array.from({length:3},()=> Array(3).fill(''));    
    // const user_data_for_socket = {};

    socket.on('joinRoom',(data,resCallBack)=>{
        
        // restricting more than two users-----------------
        if((socket.adapter.rooms.get(data.server_room_id) && socket.adapter.rooms.get(data.server_room_id).size) === 2){
            resCallBack({
                rm_status:false,                
                data:{}
            });
        } 
        else if (user_lis[data.server_room_id] && user_lis[data.server_room_id].includes(data.server_user_name)){
            resCallBack({
                rm_status:false,                
                message:"user name already exist",
                data:{}
            });

        }
        else{
            
            socket.join(data.server_room_id);

            // assign data to socket 
            socket.data = {room_id :data.server_room_id,
                user_name:data.server_user_name,
                user_turn:(socket.adapter.rooms.get(data.server_room_id).size === 1 ? 'X': 'O')};

            
            // Add user to user_lis---------------------------
            if(!user_lis[socket.data.room_id])  {
                user_lis[socket.data.room_id] = [socket.data.user_name];   
            }
            else{
                user_lis[socket.data.room_id].push(socket.data.user_name);   
            }
            console.log("user_lis",user_lis);

            //adding room in user_move_counts
            if(!user_move_counts[socket.data.room_id]) {
                user_move_counts[socket.data.room_id] = 0;
            }

            // updating isRoomFull state
            socket.in(data.server_room_id).emit('room_full');
            
            // Notify all clients in the room about the updated user list
            io.in(socket.data.room_id).emit('update_user_lis', user_lis[socket.data.room_id]);
            
            // sending back response of join room event
            resCallBack({
                rm_status:true,
                isRoomFull : (socket.adapter.rooms.get(data.server_room_id).size === 2),
                data:{client_user_name : data.server_user_name ,
                        client_user_room_id : data.server_room_id,
                        client_turn : (socket.adapter.rooms.get(data.server_room_id).size === 1 ? 'X': 'O'),
                        client_notification : "You joined the room successfully",
                        client_matrix:matrix
                        
                    }
                });

            }    
    });

    socket.on('update_move',(room_id)=>{
        socket.to(room_id).emit('update_move');
    })

    socket.on('get_user_lis',(callBackfunc)=>{
        
        callBackfunc(user_lis[socket.data.room_id]);
    })

    socket.on('new_matrix',(newMatrix,room_id)=>{
        //cheking win 
        user_move_counts[room_id] += 1;
        if(checkWin(newMatrix)) {

            io.in(room_id).emit('get_matrix',newMatrix);
            // emiting win event
            io.in(room_id).emit('game_over',socket.data.user_name,"win");
        } 
        else{
            if(user_move_counts[room_id] === 9){
                io.in(room_id).emit('game_over',socket.data.user_name,"Draw");
            }
            io.in(room_id).emit('get_matrix',newMatrix);
        } 
    })

    
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log("User disconnected from server");
        console.log("User disconnected from server");
        if (socket.data && user_lis[socket.data.room_id]) {
            user_lis[socket.data.room_id] = user_lis[socket.data.room_id].filter(user => user !== socket.data.user_name);
            if (user_lis[socket.data.room_id].length === 0) {
                delete user_lis[socket.data.room_id];
            } else {
                // Notify all clients in the room about the updated user list
                io.in(socket.data.room_id).emit('update_user_lis', user_lis[socket.data.room_id]);
            }
        }
    });

})

const port = process.env.PORT || 3001;
server.listen(port,()=>{
    console.log('server listening on port '+port)
})

//-----------------------------------Deployment code ----------------------------
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});