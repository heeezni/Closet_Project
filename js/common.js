function clearColor(){
    // 선택된 색상 표시된 div 클래스 제거
    let colorOptions = document.querySelectorAll(".color-option");
    
    for (let i = 0; i < colorOptions.length; i++) {
        colorOptions[i].classList.remove("selected");
    }
    document.getElementById("selectedColorText").innerText = "선택된 색상: 없음";
}

//데이터 리셋
function clearClosetData(){
  let tx = db.transaction("clothes", "readwrite");
  let store = tx.objectStore("clothes");
  let request = store.clear(); //기존 File 기반 데이터 전부 삭제

  request.onsuccess = function(){
    alert("기존 옷 데이터 전체 삭제 완료!");
    renderCloset(); // 화면 새로고침
  };
}

function getImageURL(image) {
    if (image instanceof File) { //File 타입이면
        return URL.createObjectURL(image);
    } else if (typeof image == "string") { //문자열이면
        return image;
    } else { //그 외면
        return ""; // 예외 대비
    }
}