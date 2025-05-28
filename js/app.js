
let closet=[];

//IndexedDB 초기 설정
let db;
const request = indexedDB.open("ClosetDB", 2); //(name, version)

request.onupgradeneeded = function(e){
    db = e.target.result;
    if( !db.objectStoreNames.contains("clothes")){ //clothes 저장소가 없을 때만 새로 생성
        db.createObjectStore("clothes", { keyPath: "id", autoIncrement: true }); //저장소 생성
    }
    if( !db.objectStoreNames.contains("coordi")){
        db.createObjectStore("coordi", { keyPath: "id", autoIncrement: true });
    }
};

request.onsuccess = function(e){
    db = e.target.result;
    console.log("IndexedDB 연결 성공");
    renderCloset(); // 앱 시작 시 자동 렌더링
};

request.onerror = function(e){
    console.error("IndexedDB 연결 실패. 이유: ", e.target.error);
};

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
        let file = imageInput.files[0]; //반드시 .files[0]로 실제 파일을 꺼내야 함

        
        if(imageInput.files.length==0){
            alert("이미지를 선택하세요!");
            return;
        }

        let tx = db.transaction("clothes", "readwrite");
        let store = tx.objectStore("clothes");

        let data = {
            name: clothesname, 
            category, 
            season, 
            color, 
            pattern, 
            image: file }

            if(id){ //수정
                data.id=parseInt(id);
                store.put(data);
            } else { // 새로등록
                store.add();
            }

        tx.oncomplete=function(){
            alert(id? "옷 정보가 수정되었습니다.":"옷이 저장되었습니다.");
            addForm.reset(); //reset()는 <form>만 가능
            document.getElementById("edit").value="";
            document.getElementById("selectedColorText").innerText = "선택된 색상: 없음";
            showView("homeView");
            renderCloset();
        };
    });
}

//등록된 옷 출력
function renderCloset(){
    let closetList = document.getElementById("closetList");
    closetList.innerHTML = "";

    let tx = db.transaction("clothes", "readonly"); //render하는 곳이니까
    let store = tx.objectStore("clothes");
    let request = store.getAll();

    request.onsuccess = function(){
        let closet = request.result;
    
        if(closet.length==0){
            closetList.innerHTML = "<p>아직 등록된 옷이 없습니다.</p>"
            return;
        }

        function filter(id){
            let el = document.getElementById(id)
            if(el){ //null이 아니면
                return el.value;
            } else {
                return "";
            }
        }
        //필터 값 가져오기
        let selectedCategory = filter("filterCategory");
        let selectedSeason = filter("filterSeason");
        let selectedColor = filter("filterColor");
        let selectedPattern = filter("filterPattern");

        let count = 0;

        for(let i=0; i<closet.length; i++){
            let item = closet[i];
            //console.log("렌더링할 아이템:", item);

            let categoryMatch = (selectedCategory == "" || selectedCategory == item.category);
            let seasonMatch = (selectedSeason == "" || selectedSeason == item.season);
            let colorMatch = (selectedColor == "" ||  selectedColor == item.color);
            let patternMatch = (selectedPattern == "" || selectedPattern == item.pattern);

            if (categoryMatch && seasonMatch && colorMatch && patternMatch){
            
            let card = document.createElement("div");
            card.className = "clothing-card" // className: 중복 적용가능

            card.innerHTML = `
            <img src="${URL.createObjectURL(item.image)}" alt="${item.name || item.clothesname}" class="clothing-img">
            <h3>${item.name}</h3>
            <p>카테고리: ${item.category}</p>
            <p>계절: ${item.season}</p>
            <p>색상: ${item.color}</p>
            <p>패턴: ${item.pattern}</p>
            <button class="delete_bt" data-id="${item.id}">삭제</button>,
            <button class="edit_bt" data-id="${item.id}">수정</button>`;

            closetList.appendChild(card);
            count++;
            }
        }
        if(count == 0){
            closetList.innerHTML = "<p>해당 조건에 맞는 옷이 없습니다.</p>"
        }
        deleteClothes();
        eidtClothes();
    };
}

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

function renderForCoordi(){
    let coordiSpace = document.getElementById("coordiCloset");
    coordiSpace.innerHTML = "";

    let tx = db.transaction("clothes", "readonly");
    let store = tx.objectStore("clothes");
    let request = store.getAll();

    request.onsuccess = function(){
        let closet = request.result;

        for(let i=0; i<closet.length; i++){
            let item = closet[i];
            
            let card = document.createElement("div");
            card.className="coordi-card"; // className: 중복 적용가능
            card.dataset.id = item.id;
    
            card.innerHTML = `<img src="${URL.createObjectURL(item.image)}" alt="${item.name || item.clothesname}" class="clothing-img">
            <p>${item.name}</p>`;
            card.addEventListener("click", function(){
                card.classList.toggle("selected"); //toggle 켜기/끄기 자동 전환
            });
            coordiSpace.appendChild(card);
        }
    };
}

function myCoordi(){
    let select = document.querySelectorAll(".coordi-card.selected");

    if(select.length == 0){
        alert("코디할 옷을 선택해주세요!");
        return;
    }
    
    //코디 이름 짓기
    let title = prompt("코디 이름을 입력하세요:");
    if(title == null || title.trim() == ""){ //trim()공백만 입력했을 때 방지
        alert("코디 이름을 입력해야 저장됩니다.");
        return;
    }

    //선택한 코디 카드들의 id
    let selectIds = [];
    for(let i=0; i<select.length; i++){
        let id = parseInt(select[i].dataset.id);
        selectIds.push(id);
    }

    let tx = db.transaction("coordi", "readwrite");
    let store = tx.objectStore("coordi");


    //새 코디 조합 객체 만들기
    let newCoordi = {
        title : title,
        items : selectIds
    };
    
    store.add(newCoordi);

    tx.oncomplete = function(){
        alert("코디가 저장되었습니다!")
        renderCoordiPreview();
        renderForCoordi();
    }
}

function renderCoordiPreview(){
    //console.log("renderCoordiPreview 실행됨!");
    let coordiContainer = document.getElementById("coordiList");
    coordiContainer.innerHTML="";

    let txCoordi = db.transaction("coordi", "readonly");
    let storeCoordi = txCoordi.objectStore("coordi");
    let requestCoordi = storeCoordi.getAll();

    requestCoordi.onsuccess = function(){
        let coordiList = requestCoordi.result;

        if(coordiList.length==0){
            coordiContainer.innerHTML="<p>저장된 코디가 없습니다.</p>"
            return;
        }

        let txCloset = db.transaction("clothes", "readonly");
        let storeCloset = txCloset.objectStore("clothes");
        let requestCloset = storeCloset.getAll();

        requestCloset.onsuccess = function(){
            let closetData = requestCloset.result;

            for(let i=0; i<coordiList.length; i++){
                let coordi = coordiList[i]; //코디 한 세트
                //console.log(coordi);
                // 1. 코디 카드
                let coordiCard = document.createElement("div"); //코디카드
                coordiCard.className = "coordi-result";
                
                // 2. 코디 제목
                let title = document.createElement("h4");
                title.innerHTML = coordi.title;
                coordiCard.appendChild(title);
        
                // 3. 코디 미리보기 박스 + 카테고리별 박스 만들기
                let {preview, slots} = coordiSlots(); // ✅ 비구조화 할당
                /*let result = CoordiSlots();
                let preview = result.preview;
                let slots = result.slots;*/
        
                /*4. 코디에 포함된 옷들 이미지로 추가 
                코디에 들어있는 옷 id 목록을 하나씩 꺼내서
                실제 옷장 데이터에서 해당 id에 맞는 옷을 찾기*/
                for(let j=0; j<coordi.items.length; j++){
                    let itemId=coordi.items[j];
                    //console.log("itemId", itemId)
                    //console.log("closetData", closetData)
        
                    let item=null;
                    for(let k=0; k<closetData.length; k++){
                        //console.log("closetData[k].id", closetData[k].id);
        
                        if(String(closetData[k].id) == String(itemId)){
                            item = closetData[k];
                            break;
                        }
                    }
                    if(item!==null && slots[item.category]){
                        //console.log("item", item);
                        let img = document.createElement("img");
                        img.src = URL.createObjectURL(item.image);
                        img.className = "clothing-img";
                        img.alt = item.name;
                        img.title = item.name;
                        
                        if(item.category == "원피스"){
                            slots["원피스"].appendChild(img);
                        } else if(slots[item.category]){
                            //console.log("item.category: ", item.category);
                            //console.log("슬롯 존재여부", slots[item.category]);
                            slots[item.category].appendChild(img);
                        }
                    }
                }
                // ✅ 원피스가 포함되어 있으면 상의/하의 칸 숨기기
                let hasOnepiece = false;
                for (let n = 0; n < coordi.items.length; n++) {
                    let itemId = coordi.items[n];
                    for (let m = 0; m < closetData.length; m++) {
                        if (String(closetData[m].id) === String(itemId) && closetData[m].category === "원피스") {
                            hasOnepiece = true;
                            break;
                        }
                    }
                }
                if (hasOnepiece) {
                    if (slots["상의"]) slots["상의"].style.display = "none";
                    if (slots["하의"]) slots["하의"].style.display = "none";
                }
                // 이미지 없는 슬롯 숨기기
                let hiddenSlots = preview.querySelectorAll(".slot");
                for (let a = 0; a < hiddenSlots.length; a++) {
                    let img = hiddenSlots[a].querySelector("img");
                    if (img == null) {
                        hiddenSlots[a].style.display = "none";
                    }
                }
                let deleteBt = document.createElement("button");
                deleteBt.className ="delete_coordi";
                deleteBt.innerText ="✖";
                deleteBt.dataset.id = coordi.id;
        
                // 5. 박스 붙이기
                coordiCard.appendChild(preview);
                coordiCard.append(deleteBt);
        
                coordiContainer.appendChild(coordiCard);
            }
            deleteCoordi(); //새로 생성된 삭제 버튼들에 click 이벤트 연결해야해서
        };
    };
}

function coordiSlots(){
    let preview = document.createElement("div");
    preview.className = "coordi-preview";
    
    let slots = {}; //카테고리 박스 저장용 빈 객체 선언

    let categories = ["상의", "하의", "원피스", "아우터", "신발", "기타"];

    for(let i=0; i<categories.length; i++){
        let cate = categories[i];

        let box = document.createElement("div");
        box.className = "slot";
        //console.dir(box);
        box.dataset.category = cate;

        if(cate == "상의") box.classList.add("top"); //box.className = "slot top"이 됨
        if(cate == "하의") box.classList.add("bottom");
        if(cate == "원피스") box.classList.add("onepiece");
        if(cate == "아우터") box.classList.add("outer");
        if(cate == "신발") box.classList.add("shoes");
        if(cate == "기타") box.classList.add("etc");


        preview.appendChild(box);
        slots[cate] = box;
    }

    return{
        preview : preview,
        slots : slots
    };
}
//출력한 카드 수정
function eidtClothes(){
    let editBts = document.querySelectorAll(".edit_bt");

    for(let i=0; i<editBts.length; i++){
        editBts[i].addEventListener("click", function(e){
            let id = parseInt(e.target.dataset.id);

            //IndexedDB에서 해당 옷 가져오기
            let tx = db.transaction("clothes", "readonly");
            let store = tx.objectStore("clothes");
            let request = store.get(id);

            request.onsuccess = function(){
                let item = request.result;

                // 등록 폼에 기존 값 채우기
                document.getElementById("editId").value = item.id;
                document.getElementById("clothesname").value = item.name;
                document.getElementById("category").value = item.category;
                document.getElementById("season").value = item.season;
                document.getElementById("pattern").value = item.pattern;

                // 색상 팔레트 반영
                let colors = document.querySelectorAll("#colorPalette .color-option");
                for(let j=0; j<colors.length; j++){
                    colors[j].classList.remove("selected");
                    if(colors[j].dataset.color == item.color){
                        colors[j].classList.add("selected");
                        document.getElementById("color").value = item.color;
                        document.getElementById("selectedColorText").innerText = `선택된 색상: ${item.color}`;
                    }
                }

                // 이미지 파일은 사용자 재선택이 필요하므로 안내
                alert("이미지는 보안상 다시 선택해 주세요");

                showView("addView");
            };
        });
    }
}


//출력한 카드 삭제
function deleteClothes(){
    let deleteBts = document.querySelectorAll(".delete_bt"); //유사배열객체 반환

    for(let i=0; i<deleteBts.length; i++){
        deleteBts[i].addEventListener("click", function(e){
            let id = parseInt(e.target.dataset.id);
        
            if(confirm("삭제하시겠습니까?")){
                let tx = db.transaction("clothes", "readwrite");
                let store = tx.objectStore("clothes");
                store.delete(id);
                
                tx.oncomplete = function(){
                    alert("삭제되었습니다.");
                    renderCloset();
                };
            } else {
                alert("삭제가 취소되었습니다.")
            }
        });
    }
}

function deleteCoordi(){
    let deleteBts = document.querySelectorAll(".delete_coordi"); //유사배열객체 반환

    for(let i=0; i<deleteBts.length; i++){
        deleteBts[i].addEventListener("click", function(e){
            let id = parseInt(e.target.dataset.id);
            //console.log("삭제할 코디 id: "+id);
            
            if(confirm("이 코디를 삭제하시겠습니까?")){
                let tx = db.transaction("coordi", "readwrite");
                let store = tx.objectStore("coordi");
                store.delete(id);
                    
                tx.oncomplete = function(){
                    alert("삭제되었습니다.");
                    renderCoordiPreview(); //화면 다시 그리기
                    deleteCoordi(); //그로 인해 새로 생성된 버튼에 다시 이벤트 연결
                };
            } else {
                alert("삭제가 취소되었습니다.")
            }
        });
    }
}
