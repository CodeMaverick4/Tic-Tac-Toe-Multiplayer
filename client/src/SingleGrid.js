import React from 'react'
import { useState } from 'react'

export default function SingleGrid({cell_value,matrix,turn,socket,room_id,rowind,colind,myTurn,setMyTurn,isRoomFull}) {
    const [isClicked,setClick] = useState((cell_value !== ""))

    function handleClick(){
        if((!isClicked) && (myTurn) && (isRoomFull)){          
          console.log("turn : ",turn,"row inx : ",colind);
          const newMatrix = matrix.map((row,rowInd)=>(
            row.map((cell,cellInd) => (((rowInd === rowind) && (colind === cellInd)) ? turn : cell )
              )
          ));
          // passing new matrix to server 
          console.log("matrix : ",newMatrix)
          socket.emit('new_matrix',newMatrix,room_id);
          setMyTurn(false);
          socket.emit('update_move',room_id);

          setClick(true);  
        }
     
    }
  return (
    <div className={` ${isClicked ? 'bg-slate-300' :'cursor-pointer bg-white'} rounded-lg size-20 flex items-center justify-center `} 
    onClick={()=> handleClick()}>
        
        <span className="text-5xl text-slate-500">{cell_value}</span> 

    </div>
  )
}
