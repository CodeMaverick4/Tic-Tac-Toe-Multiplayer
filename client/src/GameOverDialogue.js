import React from 'react'
import { Socket } from 'socket.io-client';

export default function GameOverDialogue({socket,room_id,gameOver,message,setGameOver}) {

    function handlePlayAgain(){
        window.location.reload();
    }

  return (
    <div class={`${gameOver? '' : 'hidden' } fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}>
              <div class="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
                  <div class="flex justify-between items-center border-b pb-3">
                      <h3 class={`text-lg font-semibold text-green-400 ${message === 'Draw' ? 'text-red-400': 'text-green-400'}`}>{message}</h3>                      
                  </div>
                  
                  <div class="mt-4 flex justify-center ">
                      <button onClick={()=>{handlePlayAgain()}} class="px-4 py-2 border border-black font-semibold text-white bg-black hover:bg-transparent hover:text-black rounded">Play Again !</button>
                  </div>
              </div>
    </div>
  )
}
