//폼에서 옷 등록
function saveClothesForm(){
    let addForm=document.getElementById("addForm");

    addForm.addEventListener("submit", (e) => {
        e.preventDefault(); //새로고침 방지 (폼 제출시 필수)
        
        let clothesname = document.getElementById("clothesname").value;
        let category = document.getElementById("category").value;
        let season = document.getElementById("season").value;
        let color = document.getElementById("color").value;
        let pattern = document.getElementById("pattern").value;
        let imageInput = document.getElementById("imageInput");
        let editId = document.getElementById("edit").value;

        //console.log("imageInput.files.length =", imageInput.files.length);
        //console.log("editId =", editId);

        let imageFile = imageInput.files[0]; //반드시 .files[0]로 실제 파일을 꺼내야 함

        let tx = db.transaction("clothes", "readwrite");
        let store = tx.objectStore("clothes");

        if (editId == "") {
            let newItem = { clothesname, category, season, color, pattern, image: imageFile };
            store.add(newItem).onsuccess = function(){
                alert("등록되었습니다.");
                addForm.reset();
                document.getElementById("selectedColorText").innerText = "선택된 색상: 없음";
                renderCloset();
                showView("homeView");
            };
        } else {
            let id = parseInt(editId);
            let request = store.get(id);
            request.onsuccess = function(){
                let item = request.result;
                item.clothesname = clothesname;
                item.category = category;
                item.season = season;
                item.color = color;
                item.pattern = pattern;
                if (imageFile) item.image = imageFile;

                store.put(item).onsuccess = function(){
                    alert("수정되었습니다.");
                    addForm.reset();
                    document.getElementById("selectedColorText").innerText = "선택된 색상: 없음";
                    renderCloset();
                    showView("homeView");
                };
            };
        }
    });
}

//색상 선택
function colorPalette(){
    let colorOptions = document.querySelectorAll(".color-option");

    for(let i=0; i<colorOptions.length; i++){
        colorOptions[i].addEventListener("click",()=>{
            let isSelected = colorOptions[i].classList.contains("selected");
        
            //모든 옵션의 선택 표시 제거
            for(let j=0; j<colorOptions.length; j++){
                colorOptions[j].classList.remove("selected");
            }

            if(isSelected){ //다시 클릭하면 선택 해제
                document.getElementById("color").value="";
                document.getElementById("selectedColorText").innerText = "선택된 색상: 없음";
            } else {
                //클릭한 옵션만 선택 표시 추기
                colorOptions[i].classList.add("selected");
    
                //선택된 색상 값을 hidden input에 저장 
                document.getElementById("color").value = colorOptions[i].dataset.color;
    
                //선택한 색상 텍스트 업데이트
                document.getElementById("selectedColorText").innerText = `선택된 색상: ${colorOptions[i].dataset.color}`;
            }       
        });
    }
}

//등록폼 리셋
function resetAddForm() {
    document.getElementById("addForm").reset(); //기본값 리셋
    //추가로 리셋할 항목
    document.getElementById("color").value = "";
    document.getElementById("edit").value = "";

    clearColor();
}


