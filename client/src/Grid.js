import React, { useEffect, useState } from 'react'
import SingleGrid from './SingleGrid'

export default function Grid({socket,user_data,matrix,setMatrix,isRoomFull}) {
    
    const [user_lis ,setUserLis] = useState([]);                  
    const [myTurn,setMyTurn] = useState((user_data.data.client_turn === 'X' ? true : false));     
    
    useEffect(()=>{
        if(!socket) return;
         socket.on('get_matrix',(mat)=>{
            console.log("got the matrix",matrix)    
            setMatrix(mat);
         })
        

        //  receving user using call back 
        socket.emit('get_user_lis',(response)=>{
            console.log('calling for data ',response);
            setUserLis(response);
        })

        // Listen for user list updates
        socket.on('update_user_lis', (updatedUserLis) => {
            console.log('updated user list', updatedUserLis);
            setUserLis(updatedUserLis);
        });

        socket.on('update_move',()=>setMyTurn(true));


         return () => {
            socket.off('get_matrix');
          }; 
    },[socket,setMatrix,matrix])


    

  return (
    <div className="h-screen w-screen ">
                        
            {/* status section  */}
            <div className=" flex justify-center items-center flex-col gap-4 ">
            <p className="text-5xl">Welcome {user_data.data.client_user_name}</p>
                <p className="text-3xl">You are a {user_data.data.client_turn} player</p>

                {isRoomFull ? 
                <p>{myTurn ? "Your Turn" : "wait for other player to take his turn" }</p>
                : <p>Wait for other user to join</p> }
                
                
                {/* grid  */}
                
                
                <div className={`rounded-md grid grid-cols-3 gap-3 bg-yellow-500 p-3 `}  >
                    {/* SingleGrid  */}
                    {matrix ? (
                                matrix.map((row, rowIdx) => (
                                    row.map((cell, cellIdx) => (
                                    <SingleGrid
                                        cell_value={cell}
                                        key={`${rowIdx}_${cellIdx}`}
                                        matrix={matrix}
                                        socket={socket}
                                        turn={user_data.data.client_turn}
                                        room_id={user_data.data.client_user_room_id}
                                        rowind={rowIdx}
                                        colind={cellIdx}
                                        myTurn={myTurn}
                                        setMyTurn={setMyTurn}
                                        isRoomFull={isRoomFull}
                                    />
                                    ))
                                ))
                                ) : (
                                <h1>Loading...</h1>
                                )}

                </div>
            
            </div>

            {/* User login status  */}
            <div className="absolute p-2 bottom-6 right-4"> 
                {user_lis.map(user=>(
                    
                    <p className='p-2 bg-slate-300 rounded-md'> {user}</p>
                    
                    
                ))}
            </div>
            
    </div>
  )
}
