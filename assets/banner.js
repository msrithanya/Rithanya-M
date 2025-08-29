var open=0;
function open_menu() {
    if(open==0){
        document.getElementById("mobile_menu").style.display = "flex";
        document.getElementById("menu_img").style.display="none";
         document.getElementById("close_img").style.display="block";
        open=1;
    }
    else{
         document.getElementById("mobile_menu").style.display = "none";
          document.getElementById("menu_img").style.display="block";
         document.getElementById("close_img").style.display="none";
         open=0;
    }
}