import RoomComponent from './RoomComponent';
import Grid from './Grid';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import GameOverDialogue from './GameOverDialogue';

function App() {
  const [socket,setSocket] = useState(undefined);
  const [rm_join_status,setJoinStatus] = useState({rm_status:false,data:{}});
  const [matrix ,setMatrix] = useState([]);
  const [isRoomFull,setRoom] = useState(false);

  // state change when checkwin condition in server get true.
  const [gameOver,setGameOver] = useState(false);
  const [message,setMessage] = useState(" win!!! ");
                                                     


  useEffect(() => {
    const new_socket = io('https://tic-tac-toe-multiplayer-3x61.onrender.com', {
      // reconnection: false,
    });
    setSocket(new_socket);

    new_socket.on('room_full',()=>setRoom(true));

    //listening for game over condition
    new_socket.on('game_over',(user_name,message)=> {
      if(message==="win") setMessage('Player '+user_name+" win!!! ");
      else setMessage("Draw");
        setGameOver(true);
      }
    ) 
    
    // Cleanup function to disconnect the socket when the component unmounts
    return () => {
      new_socket.disconnect();
      console.log('Socket disconnected');
    };
  }, []); 

  return (
        // <div className=" h-screen w-screen flex justify-center items-center bg-gradient-to-tr from-cyan-400 to-purple-600 font-mono">
          <div className=" h-screen w-screen flex justify-center items-center bg-slate-500 font-mono">
          {/* <h1 className="absolute text-5xl top-0 right-0 left-0 m-auto ">Welcome to tic tac toe</h1> */}
          
          {gameOver ? <GameOverDialogue  gameOver={gameOver} message={message} socket={socket} setGameOver={setGameOver} room_id={rm_join_status.data.client_user_room_id}/> : ''}
           {/* first division  room commp only show when user don't join in any room */}
           {rm_join_status.rm_status && socket ? '': <RoomComponent socket={socket} setMatrix={setMatrix} setJoinStatus={setJoinStatus} setRoom={setRoom} />}
          

          {/* second division grid only visible after joining room */}
          {rm_join_status.rm_status && socket ? <Grid socket={socket} matrix={matrix} user_data= {rm_join_status} setMatrix={setMatrix} isRoomFull={isRoomFull} /> :''}
          
        </div>
  );
}

export default App;
