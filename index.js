function generate_table() {
    var table = document.getElementById("table_input");
    var row = table.insertRow(-1);
    for (var j = 0; j < 4; j++) {
        var cell1 = row.insertCell(-1);
        var element1 = document.createElement("td");
        element1.innerHTML = document.getElementById(j).value;
        element1.style.textAlign = "center";
        element1.style.width = "150";
        element1.style.borderColor = "black";
        element1.style.background = "white";
        cell1.appendChild(element1);
        document.getElementById(j).value = '';
    }
}
function Data(PID, arrival_time, burst_time, priority) {
    this.PID = parseInt(PID);
    this.arrival_time = parseInt(arrival_time);
    this.burst_time = parseInt(burst_time);
    this.priority = parseInt(priority);
    this.completed = parseInt(burst_time);
    this.waiting_time = 0;
    this.reset = function () {
        waiting_time = parseInt(0);
        completed = parseInt(burst_time);
    }
    this.work = function (time_quanta, time) {
        var retTime = 0;
        if (time_quanta > 0) {
            if (time_quanta <= this.completed) {
                this.completed = this.completed - time_quanta;
                retTime = time_quanta;
            }
            else {
                retTime = parseInt(this.completed);
                this.completed = 0;
            }
            return retTime;
        }
        else {
            retTime = parseInt(this.completed);
            this.completed = 0;
        }
        return retTime;
    }
    this.waiting_time = function (waitingTime) {
        this.waiting_time = waitingTime;
    }
}
function output(time, PID) {
    this.time = time;
    this.PID = PID;
}
function read_data() {
    var table = $('#table_input').tableToJSON();
    no_of_processes = table.length - 1;
    var processes = [];
    for (var i = 1; i < table.length; i++) {
        processes[i - 1] = new Data(table[i].PID, table[i].Arrival, table[i].Burst, table[i].Priority);
    }
    var time_quanta = parseInt(document.getElementById("quanta").value);
    var Algorithm = document.getElementsByName("Algorithm");
    for (i = 0; i < Algorithm.length; i++) {
        if (Algorithm[i].checked)
            var Scheduler = Algorithm[i].value;
    }
    if (Scheduler == "PR_withPREMP") {
        var ready_queue = [];
        processes.sort(function (a, b) { return a.arrival_time - b.arrival_time });
        var running_in_cpu = new Data(0, 0, 0, 0);
        var process_done = 0, time = 0, last = -1;
        while (process_done < no_of_processes) {
            for (var i = 0; i < no_of_processes; i++) {
                if (last < processes[i].arrival_time && processes[i].arrival_time <= time)
                    ready_queue.push(processes[i]);
            }
            if (running_in_cpu.PID != 0 && running_in_cpu.completed != 0) {
                ready_queue.push(running_in_cpu);
            }
            ready_queue.sort(function (a, b) { return a.priority - b.priority });
            running_in_cpu = ready_queue.shift();
            var timeTaken = time + parseInt(running_in_cpu.completed);
            var interruptTime = 0;
            for (var i = 0; i < no_of_processes; i++) {
                if (last < processes[i].arrival_time && processes[i].arrival_time < timeTaken && processes[i].priority < running_in_cpu.priority) {
                    interruptTime = processes[i].arrival_time - time;
                    break;
                }
            }
            last = time;
            generate_output(time, running_in_cpu.PID);
            time += running_in_cpu.work(interruptTime, time);
            if (running_in_cpu.completed == 0) {
                process_done += 1;
                running_in_cpu.waiting_time(time - running_in_cpu.burst_time - running_in_cpu.arrival_time);
            }
        }
    }
    if (Scheduler == "PR_noPREMP") {
        var ready_queue = [];
        processes.sort(function (a, b) { return a.arrival_time - b.arrival_time });
        var running_in_cpu = new Data(0, 0, 0, 0);
        var process_done = 0, time = 0, last = -1;
        while (process_done < no_of_processes) {
            for (var i = 0; i < no_of_processes; i++) {
                if (last < processes[i].arrival_time && processes[i].arrival_time <= time)
                    ready_queue.push(processes[i]);
            }
            processes.sort(function (a, b) { return a.priority - b.priority });
            running_in_cpu = ready_queue.shift();
            last = time;
            generate_output(time, running_in_cpu.PID);
            time += running_in_cpu.work(0, time);
            if (running_in_cpu.completed == 0) {
                process_done += 1;
                running_in_cpu.waiting_time(time - running_in_cpu.burst_time - running_in_cpu.arrival_time);
            }
        }
    }
    if (Scheduler == "SJF") {
        var ready_queue = [];//A ready queue has been declared 
        processes.sort(function (a, b) { return a.burst_time - b.burst_time });
        var running_in_cpu = new Data(0, 0, 0, 0);
        var process_done = 0, time = 0, last = -1;
        while (process_done < no_of_processes) {
            for (var i = 0; i < no_of_processes; i++) {
                if (last < processes[i].arrival_time && processes[i].arrival_time <= time)
                    ready_queue.push(processes[i]);//Load process according to the arrival time and burst time
            }
            ready_queue.sort(function (a, b) { return a.burst_time - b.burst_time });
            running_in_cpu = ready_queue.shift();
            last = time;
            generate_output(time, running_in_cpu.PID);// printing cpu status at current time
            time += running_in_cpu.work(0, time);
            if (running_in_cpu.completed == 0) {
                process_done += 1;
                running_in_cpu.waiting_time(time - running_in_cpu.burst_time - running_in_cpu.arrival_time);
            }
        }
    }
    if (Scheduler == "RR") {
        var ready_queue = [];//A ready queue has been declared 
        processes.sort(function (a, b) { return a.arrival_time - b.arrival_time });
        var last = -1, time = 0, process_done = 0;//variables to hold time, previous states and job status
        var running_in_cpu = new Data(0, 0, 0, 0);//initially process in cpu is null
        while (process_done < no_of_processes) {//Run until all processes are done
            for (var i = 0; i < processes.length; i++)//loading processes into ready queue based on arrival time
            {
                if (last < processes[i].arrival_time && processes[i].arrival_time <= time)
                    ready_queue.push(processes[i]);//since processes has been sorted according to their arrival time
            }
            if (running_in_cpu.PID != 0 && running_in_cpu.completed != 0)//loading process in cpu at the end of ready queue based upon its completion status
            {
                ready_queue.push(running_in_cpu);
            }
            running_in_cpu = ready_queue.shift();//Giving CPU to process at the front of queue
            last = time;//storing current status into variables for calculation purposes
            generate_output(time, running_in_cpu.PID);// printing cpu status at current time
            time = time + running_in_cpu.work(time_quanta);//updating time variable
            if (running_in_cpu.completed == 0) {//updating number of process completed
                process_done++;
                running_in_cpu.waiting_time(time - running_in_cpu.burst_time - running_in_cpu.arrival_time);//update waiting time for each process
            }
        }
    }
    average_waiting_time();
    function average_waiting_time() {
        var total_waiting_time = 0;
        for (var i = 0; i < no_of_processes; i++) {
            total_waiting_time += processes[i].waiting_time;//add waiting time of each process
            processes[i].reset();
        }
        document.getElementById("avg").innerHTML = "AVG Waiting Time: " + total_waiting_time / (no_of_processes);
    };

}
function generate_output(time, PID) {
    var node = document.createElement("li");
    var textnode = document.createTextNode(time);
    node.appendChild(textnode);
    document.getElementById("gantt").appendChild(node);
}



