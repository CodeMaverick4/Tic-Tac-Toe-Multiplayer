
import React, { useState } from 'react'

export default function RoomComponent({socket,setJoinStatus,setMatrix,setRoom}) {
  const[message,setMessage] = useState(false);
  const [error,setError] = useState('');
  
  function handleRoomJoin(){
    console.log("handle click called")
    
    const client_room_id = document.getElementById('room_id').value;
    const client_us_name = document.getElementById('user_name').value;

    if( (client_room_id === '') || (client_us_name === '') ){
      setError(`please enter valid ${client_room_id === '' ? 'room id' : 'user name'}`);
      return
    }
    socket.emit('joinRoom',{server_user_name : client_us_name, server_room_id : client_room_id},(response)=>{
      
      // console.log("server response with data: ",response);
      if(!response.rm_status && response.message){
        setError(response.message);
      }
      else if(response.rm_status){
        const temp = {rm_status:response.rm_status,data:response.data};
        setMatrix(response.data.client_matrix);
        setJoinStatus(temp);
        setRoom(response.isRoomFull);
        
        // setUserLis(response.data.client_lis)
      }
      else{
        setMessage(true);
        setTimeout(()=>setMessage(false),3000);
      }

    });


  }

  return (
    <div className="flex justify-center items-center flex-col">
      {message ? (<p className='text-red-300'> Sorry room capacity is full </p>) : ''}
    <div className="flex flex-col gap-3">
        <p>To join the game enter Room Id </p>
        <input id="user_name" type="text" className="p-2 rounded-lg  outline-none focus:bg-slate-600 " placeholder="Enter Name here..."/>
        
        <input id="room_id" type="text" className="p-2 rounded-lg  outline-none focus:bg-slate-600 " placeholder="Enter Room ID here ..."/>
        {error && <p className='text-red-300'>{error}</p>}
        <button onClick={()=>handleRoomJoin()} className="rounded-md p-3 border-black border hover:bg-transparent hover:text-black bg-black text-white">Join room</button>
    </div>
  </div>    
  )
}
