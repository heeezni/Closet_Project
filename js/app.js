
//모든 section 숨김처리, 특정 화면만 보이게 함
function showView(viewId){
    let home=document.getElementById("homeView");
    let add=document.getElementById("addView");
    let coordi=document.getElementById("coordiView");

    home.style.display="none";
    add.style.display="none";
    coordi.style.display="none";

    //선택한 화면만 보이게 함
    let target=document.getElementById(viewId);
    target.style.display="block";
}







