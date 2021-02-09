function generate_table() {
    var table = document.getElementById("table_input");
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(-1);
    var element1 = document.createElement("td");
    element1.innerHTML = document.getElementById(0).value;
    element1.style.textAlign = "center";
    element1.style.width = "150";
    cell1.appendChild(element1);
    document.getElementById(0).value = '';
}
function read_data() {
    var table = $('#table_input').tableToJSON();
    var total_page_requests = table.length - 1;
    var total_frames = parseInt(document.getElementById("frames").value);
    var pages = parseInt(document.getElementById("pages").value);
	var page_requests = [];
    for (var i = 1; i < table.length; i++) {
        page_requests[i - 1] = table[i];
    }
    var Algorithm = document.getElementsByName("Algorithm");
    for (i = 0; i < Algorithm.length; i++) {
        if (Algorithm[i].checked)
            var Scheduler = Algorithm[i].value;
    }
    if(Scheduler == "FIFO"){
        var frames = new Array(total_frames);
        var flag=0,count=0,frame_to_unload=0,page_fault=0,current_page_request=0;
        for(var i=0;i<total_page_requests;i++){
            flag=0;
            current_page_request=page_requests[i].Page;
            for(var k=0;k<total_frames;k++)
                if(frames[k]==current_page_request){
                    console.log("Page "+current_page_request+" already in Frame "+k);
                    flag=1;
                }
                if(flag==0){//start loading pages into frames
                    if(count==total_frames){//wait until all frames are used to start unloading
                        console.log("Page "+frames[frame_to_unload]+" unloaded from Frame "+frame_to_unload+", ");
                        count--;
                    }
                    frames[frame_to_unload]=current_page_request;
                    console.log("Page "+current_page_request+" loaded into Frame "+frame_to_unload);
                    frame_to_unload=(frame_to_unload+1) % total_frames;
                    page_fault++;
                    count++;
                }
            }
            console.log(page_fault+" page faults");
    }
}

   
    
