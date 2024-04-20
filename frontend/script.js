async function registerUser(){
    
    const name=document.getElementById("registerName").value
    const email=document.getElementById("registerEmail").value
    const password=document.getElementById("registerPassword").value
    

    
    try{
        const createdUser= await fetch("/api/v1/users/register",{
            method:"POST",
            headers:{
                'Content-Type': 'application/json'
            },
            //newUser
            body:JSON.stringify({
                name,
                email,
                password
            })
        })
        const createdUserJSON = await createdUser.json()
        if (createdUserJSON){
            alert(createdUserJSON.message)
        }
    }catch(error){
        alert(`error happened ${error}`)
    }

}

async function loginUser(){
    
    const email=document.getElementById("loginName").value
    const password=document.getElementById("loginPassword").value
    

    
    try{
        const logInUser= await fetch("/api/v1/users/login",{
            method:"POST",
            headers:{
                'Content-Type': 'application/json'
            },
            //newUser
            body:JSON.stringify({
                
                email,
                password
            })
        })
        const logInUserJSON = await logInUser.json()
        if (logInUserJSON){
            localStorage.setItem(`token`, logInUserJSON.data.token)
            alert(logInUserJSON.message)
            window.location.href = `https://expense-tracker-wa0y.onrender.com`
        }
    }catch(error){
        alert(`error happened ${error}`)
    }
}