// main function 
function checkWin(newMatrix){
    // checking horizontally 
    const hori = newMatrix.map(row=>{
        return checkArryEle(row);
    })

    // checking each row or horizontal check
    function checkArryEle(arr){
        return (arr.every(ele=>ele === "X") || arr.every(ele=>ele === "O"))
    }
    
    // checking vertically  
    const verti = () => {
        for(let i=0 ;i<newMatrix.length;i++){
            let temp =[] ;
            for(let j=0 ;j<newMatrix.length;j++){
                temp.push(newMatrix[j][i]);
                
                }
                if(!checkArryEle(temp)){
                    continue;
                }
                else{
                    return true
                }
            }
        return false;
    }

    return (verti() || hori.some(ele=>ele===true) || rightDiagonalCheck(newMatrix) || leftDiagonalCheck(newMatrix));

}

// checking diagonally 
function leftDiagonalCheck(newMatrix){
    // digonal check 
    let temp = newMatrix[0][0];
    if (temp === 'X' || temp === "O"){
        
        for(let i =0;i<newMatrix.length;i++){
            if (temp != newMatrix[i][i]){
                return false;
            }
        }
        return true;
    }
    return false
}

// checking diagonally 
function rightDiagonalCheck(newMatrix){
   const  temp = newMatrix[0][newMatrix.length-1];
   if (temp === 'X' || temp === "O"){
        let j = newMatrix.length-1;
        for(let i =0;i<newMatrix.length;i++){
            if (temp != newMatrix[i][j]){
                return false;
                }
            j--;
            }
    return true;
    }
    return false    
}
    



module.exports = checkWin