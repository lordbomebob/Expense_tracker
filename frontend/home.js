

let expenseList=[]

function checkIfUserLoggedIn(){
    const token= localStorage.getItem(`token`)
    if(!token){
        window.location.href = `http://localhost:4000/`
    }
}

async function CreateExpense(){
    
    const title=document.getElementById("title").value
    const description=document.getElementById("description").value
    const year=document.getElementById("year").value
    const month=document.getElementById("month").value
    const day=document.getElementById("day").value
    const cost=document.getElementById("cost").value
    const type=document.getElementById("type").value
    
    const date=`${year}-${month}-${day}`
    if(year=="year" || month=="month" || day=="day"){
        alert("invadlid date")
        return
    }

    
    
    const token= localStorage.getItem(`token`)
    if (!token) {
        alert("TOKEN NOT FOUND!")
        return
    }
    if(!year || !month || !day){
        alert("missing date")
        return
    }
    try{
        const createdExpense= await fetch("/api/v1/users/expense",{
            method:"POST",
            headers:{
                'Content-Type': 'application/json',
                "Authorization": token
            },
            //newExpense
            body:JSON.stringify({
                title,
                description,
                date,
                cost,
                type

            })
        })
        const createdExpenseJSON = await createdExpense.json()
        if (createdExpenseJSON){
            alert(createdExpenseJSON.message)
        }
    }catch(error){
        alert(`error happened ${error}`)
    }
    generateAllExpense(expenseList)
}

async function GetAllExpense(){
    try{
        const allExpense = await fetch("/api/v1/users/expense")
        const  allExpenseJson = await allExpense.json()
        expenseList=allExpenseJson.data
        
        generateAllExpense(expenseList)
    }catch(error){
        alert(`error at getExpense`)
    }
    
}

async function generateAllExpense(expenseList){
    const expenseElements = document.getElementById('ExpenseItems')
    expenseElements.innerHTML=""
    
    for(let expense of expenseList){
        const expenseCard=`
        <div id="accordion-${expense._id}">
            <div class="accordion-item" >
                <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${expense._id}" aria-expanded="false" aria-controls="collapse${expense._id}">
                <!--Accordion title-->
                ${expense.title} ${expense.date.slice(0,10)} $${expense.cost}
                </button>
                </h2>
                <div id="collapse${expense._id}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                    <!--acordian body-->
                        <div>
                            <strong>Type:</strong> ${expense.type}     <strong>Description:</strong> ${expense.description}
                        </div>
                    <button type="button" class="btn btn-danger" onclick="DeleteExpense('${expense._id}')">DELETE</button>
                    </div>
                </div>
            </div>
        </div>`
        expenseElements.innerHTML+=expenseCard
        
    }
}

async function DeleteExpense(delId){
    const token= localStorage.getItem(`token`)
    if (!token) {
        alert("TOKEN NOT FOUND!")
        return
    }
    try{
        const deleteExpense= await fetch("/api/v1/users/expense",{
            method:"DELETE",
            headers:{
                'Content-Type': 'application/json',
                "Authorization": token
            },
            //delete id
            body:JSON.stringify({
                _id:delId

            })
        })
        const deleteExpenseJSON = await deleteExpense.json()
        
        if (deleteExpenseJSON){
            alert(deleteExpenseJSON.message,)
        }
        const accordionExpenseElements = document.getElementById(`accordion-${delId}`)
        accordionExpenseElements.innerHTML=""
        const filterAEE=document.getElementById(`filter-${delId}`)
        if(filterAEE){
            filterAEE.innerHTML=""
        }
    }catch(error){
        alert(`error happened ${error}`)
    }
    
}
function filterExpense(){
    const expenseElements = document.getElementById('Filtered-Expense')
    const filterYearElements= document.getElementById('filter-year')
    const filterMonthElements= document.getElementById('filter-month')
    const filterYear=filterYearElements.value
    const filterMonth=filterMonthElements.value
    expenseElements.innerHTML=""
    let filterCost=0
    for(let expense of expenseList){
        
        const expenseCard=`
        <div id="filter-${expense._id}">
        <div class="accordion-item" >
        <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${expense._id}-filter" aria-expanded="false" aria-controls="collapse${expense._id}-filter">
            <!--Accordion title-->
            ${expense.title} ${expense.date.slice(0,10)} $${expense.cost}
          </button>
        </h2>
        <div id="collapse${expense._id}-filter" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
          <div class="accordion-body">
              <!--acordian body-->
              <div>
                <strong>Type:</strong> ${expense.type}     <strong>Description:</strong> ${expense.description}
              </div>
              <button type="button" class="btn btn-danger" onclick="DeleteExpense('${expense._id}')">DELETE</button>
          </div>
        </div>
      </div>
      </div>`
      let yearExpense=expense.date.slice(0,4)
      let monthExpense=expense.date.slice(6,7)
      
        if(yearExpense==filterYear && monthExpense==filterMonth){
            filterCost+=expense.cost
            expenseElements.innerHTML+=expenseCard
        }else if(filterYear=="year" && monthExpense==filterMonth){
            filterCost+=expense.cost
            expenseElements.innerHTML+=expenseCard
        }else if(yearExpense==filterYear && "month"==filterMonth){
            filterCost+=expense.cost
            expenseElements.innerHTML+=expenseCard
        }
        
    }
    document.getElementById('filter-total').innerHTML=filterCost.toFixed(2)
}

function logout() {
    
    localStorage.removeItem('token');
    window.location.href = `http://localhost:4000/`
}

function addOption(htmlID,start,end,accending){
    const htmlElement = document.getElementById(htmlID)
    if(accending){
        for(let x=start;x<end+1;x++){
            htmlElement.innerHTML+=`<option value="${x}">${x}</option>`
        }
    }else{
        for(let x=start;x>end+1;x--){
            htmlElement.innerHTML+=`<option value="${x}">${x}</option>`
        }
    }

}

checkIfUserLoggedIn()
GetAllExpense()
addOption("year",2025,1950,false)
addOption("month",1,12,true)
addOption("day",1,31,true)

addOption("filter-month",1,12,true)
addOption("filter-year",2025,1950,false)