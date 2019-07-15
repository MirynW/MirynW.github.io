// cache dom
const user_input = document.querySelector('.user-input');
const task_list = document.querySelector('#task-list');
// get div-add
const title = document.querySelector('#form-title');
const date = document.querySelector('#small');
const details = document.querySelector('#form-details');



// Globals
let user_tasks = [];
let url = 'https://fringuante-monsieur-20464.herokuapp.com/posts';
let other_params = '';
let jsonObject;

function show() {
    user_input.classList.toggle('show');
    console.log('clicked');
}

// GET request to api
/*document.addEventListener("DOMContentLoaded", () => {
    fetch(url, other_params)
        .then( res => {
            if(res.ok)
                return res.json();
            else {
                throw new Error('Could Not Reach The API: ' + res.statusText0);
            }
        })
        .then( data => {
            user_tasks = data;
        })
        .catch( err => {
            console.log(err);
        });
});*/
document.addEventListener("DOMContentLoaded", async () => {
    jsonObject = await getData();
    console.log('here');
    load();
});

async function getData() {
    const response = await fetch(url);
    
    return response.json();
}

// Function for pulling user input
function submit() {
    //Get user date
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    let id = Math.random() * 100000;
    while(id == checkIds(user_tasks, id))
        id = Math.random() * 100000;

    today = mm + '/' + dd + '/' + yyyy;
    console.log('submitted');
    let task = new Object();
    task.identifier = id;
    task.date = date.value;
    task.title = title.value;
    task.details = details.value;
    task.date_added = today;
    task.year = parseInt((date.value.substring(date.value.length-2, date.value.length)), 10);
    task.month = parseInt((date.value.substring(0,2)), 10);
    task.day = parseInt((date.value.substring(3,5)), 10);
    console.log(task.month + "/" + task.day + "/" + task.year);
    //Push onto list stack
    user_tasks.push(task);   
    //Reset input values 
    date.value = '';
    title.value = '';
    details.value = '';
    //Add task and render
    addTask(task, false);
}


//Add task
function addTask(task, isReloading) {
    //let str = task_list.innerHTML;
    let node = document.createElement('DIV'); 
    const ctitle = parseTitle(task.title);
    const cdate = parseDate(task.date);
    if(ctitle && cdate) {
        node.innerHTML = `<article id="task-list" class="box-container"><h3 class="box-title">${task.title}</h3><button class="remove" onclick="remove(${task.identifier})">X</button></br><p>due: ${task.date}</p></hr><div class="text-box"><p>${task.details}</p></div><p class="added-date">added: ${task.date_added}</p></article>`;
        task_list.appendChild(node);
        if(!isReloading)
            send(task);
    } else {
        if(ctitle == false && cdate == true) {
            title.classList.toggle('warning');
            //set time out
            setTimeout(() => {
                date.classList.toggle('warning');
            }, 2000);
        }
        else if(cdate == false && ctitle == true) {
            //change class
            date.classList.toggle('warning');
            //set time out
            setTimeout(() => {
                date.classList.toggle('warning');
            }, 2000);
        }
        else {
            //change class
            date.classList.toggle('warning');
            title.classList.toggle('warning');
            //set time out
            setTimeout(() => {
                date.classList.toggle('warning');
                title.classList.toggle('warning');
            }, 2000);
        }
        user_tasks.pop();
    }
    console.log(task_list);
}

// Delete Request
function deleteRequest(task) {
    fetch(url + "/" + task._id, {
        method: 'DELETE'
      }).then(() => {
         console.log('removed');
      }).catch(err => {
        console.error(err)
      });
}


// Post request
function send(task) {
    const jsonTask = {
        title: task.title,
        datedue: task.date,
        description: task.details,
        date: task.date_added,
        intid: task.identifier
    }


    fetch(url, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(jsonTask), // data can be `string` or {object}!
        headers:{
        'Content-Type': 'application/json'
        }
    }).then(res => res.json())
    .then(response => console.log('Success:', JSON.stringify(response)))
    .catch(error => console.error('Error:', error));
}


function load() {
    let obj;
    for(let i=0; i<jsonObject.length; i++) {
        obj = jsonObject[i];
        //create task
        let id = Math.random() * 100000;
        while(id == checkIds(user_tasks, id))
            id = Math.random() * 100000;

        let task = new Object();
        task.identifier = id;
        task.date = obj.datedue;
        task.title = obj.title;
        task.details = obj.description;
        task.date_added = obj.date;
        task._id = obj._id;
        task.year = parseInt((obj.date.substring(obj.date.length-2, obj.date.length)), 10);
        task.month = parseInt((obj.date.substring(0,2)), 10);
        task.day = parseInt((obj.date.substring(3,5)), 10);
        user_tasks.push(task);  
        addTask(task, true);
    }

    
}


//Load from
function loadTask(user_tasks) {
    //let str = task_list.innerHTML;
    user_tasks.forEach(task => {
        const ctitle = parseTitle(task.title);
        const cdate = parseDate(task.date);
        if(ctitle && cdate) {
            let node = document.createElement('DIV'); 
            node.setAttribute('id', `${task.identifier}`);
            node.innerHTML = `<article id="task-list" class="box-container"><h3 class="box-title">${task.title}</h3><button class="remove" onclick="remove(${task.identifier})">X</button></br><p>due: ${task.date}</p></hr><div class="text-box"><p>${task.details}</p></div><p class="added-date">added: ${task.date_added}</p></article>`;
            task_list.appendChild(node);
        } else {
            if(ctitle == false && cdate == true)
                alert('Title limit is 27 characters');
            else if(cdate == false && ctitle == true)
                alert('Please format the date in mm/dd/yy(yyyy)');
            else
                alert('Title limit is 27 characters and the date must be formatted as mm/dd/yy(yyyy)');
            user_tasks.pop();
        }
    });
}


//Parse
function parseTitle(ptitle) {
    if(ptitle.length < 28)
        return true;
    return false;
}

function parseDate(pdate) { 
    if(pdate.length > 11)
        return false;
    if(pdate.charAt(2) != '/' || pdate.charAt(5) != '/')
        return false;
    for(i=0; i<pdate.length-1; i++) {
        if(pdate.charAt(i) < '0' || pdate.charAt(i) > '9') {
            if(pdate.charAt(i) != '/')
                return false;
            if(i != 2 && i != 5 )
                return false;
        }
    }
    return true;
}

function sort() {
    let temptask = new Object();
    for( i=0; i<user_tasks.length; i++ ) {
        for( j=0; j<user_tasks.length-i-1; j++ ) {
            if(user_tasks[j].year > user_tasks[j+1].year) {
                temptask = user_tasks[j];
                user_tasks[j] = user_tasks[j+1];
                user_tasks[j+1] = temptask;
            } 
            if (user_tasks[j].year == user_tasks[j+1].year) {
                if( user_tasks[j].month > user_tasks[j+1].month) {
                    temptask = user_tasks[j];
                    user_tasks[j] = user_tasks[j+1];
                    user_tasks[j+1] = temptask;
                }
            } 
            if( user_tasks[j].month == user_tasks[j+1].month) {
                if( user_tasks[j].day > user_tasks[j+1].day) {
                    temptask = user_tasks[j];
                    user_tasks[j] = user_tasks[j+1];
                    user_tasks[j+1] = temptask;
                }
            }
        }
    }
    removeChildElements();
    loadTask(user_tasks);
}

function removeChildElements() {
    //for child in task_list .remove(child);
    var child;
    while ((child = task_list.firstChild)) {
        task_list.removeChild(child);
    }
}

function checkIds(task_list, id) {
    user_tasks.forEach(task => {
        if(task.identifier == id)
            return true;
    });
    return false;
}

function remove(unique_id) {
    let temp = new Object();
    let flag = false;
    let index = 0;
    console.log(user_tasks.length);
    user_tasks.forEach(task => {
        if(task.identifier == unique_id) {
            index = user_tasks.indexOf(task);
        }
    });
    deleteRequest(user_tasks[index]);
    user_tasks.splice(index,1);
    console.log(user_tasks.length);
    removeChildElements();
    loadTask(user_tasks);
}

//->place user data into a new object -> JSON -> Webserver/nodejs
//> We want to create the todo list as well as the date and place it into a new html table
//Auto sort task by date (Row)
//User can manually move task over or we can automate the proccess by
//using the github api flow to check for pull and push requests

//Function for placing data into new component
