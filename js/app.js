
let imageData;
let storeData;
let closet;

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
        
        let imageInput = document.getElementById("imageInput");
        let clothesname = document.getElementById("clothesname").value;
        let category = document.getElementById("category").value;
        let season = document.getElementById("season").value;
        let color = document.getElementById("color").value;
        let pattern = document.getElementById("pattern").value;

        if(imageInput.files.length==0){
            alert("이미지를 선택하세요!");
            return;
        }

        let file = imageInput.files[0];

        let reader = new FileReader(); 
        reader.onload = function(data){
            imageData = data.target.result;

            let clothing = {
                id : Date.now(), //등록 순간의 시간을 고유 ID로
                name : clothesname,
                category : category,
                season : season,
                color : color,
                pattern : pattern,
                image : imageData
            };

            storeData = localStorage.getItem("closet");
            if(storeData==null){
                closet = []; // 아무 것도 없으면, 새 배열로 시작
            }else{
                closet = JSON.parse(storeData); //저장된 문자열이 있으면 배열로 파싱
            }

            closet.push(clothing);

            localStorage.setItem("closet", JSON.stringify(closet));
            alert("옷이 저장되었어요!");
            addForm.reset(); //reset()는 <form>만 가능
            showView("homeView");
            renderCloset();
        };
        reader.readAsDataURL(file);
    });
}

//등록된 옷 출력
function renderCloset(){
    let closetList = document.getElementById("closetList");
    closetList.innerHTML = "";

    //storeData의 최신값 다시 가져오기
    storeData = localStorage.getItem("closet");

    if(storeData==null){
        closet = [];
    }else{
        closet=JSON.parse(storeData);
    }

    if(closet.length==0){
        closetList.innerHTML = "<p>아직 등록된 옷이 없습니다.</p>"
        return;
    }

    //필터 값 가져오기
    let selectedCategory = document.getElementById("filterCategory").value;
    let selectedSeason = document.getElementById("filterSeason").value;
    let selectedColor = document.getElementById("filterColor").value;
    let selectedPattern = document.getElementById("filterPattern").value;

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
        <img src="${item.image}" alt="${item.name}" class="clothing-img">
        <h3>${item.name}</h3>
        <p>카테고리: ${item.category}</p>
        <p>계절: ${item.season}</p>
        <p>색상: ${item.color}</p>
        <p>패턴: ${item.pattern}</p>
        <button class="delete_bt" data-id="${item.id}">삭제</button>`;

        closetList.appendChild(card);
        count++;
        }
    }
    if(count == 0){
        closetList.innerHTML = "<p>해당 조건에 맞는 옷이 없습니다.</p>"
    }
    deleteClothes();
}

//출력한 카드 삭제
function deleteClothes(){
    let delete_bts = document.querySelectorAll(".delete_bt"); //유사배열객체 반환
    //console.log("삭제 버튼 개수는", delete_bts.length);

    for(let i=0; i<delete_bts.length; i++){
        delete_bts[i].addEventListener("click", (e) => {
            //console.dir(delete_bts[i]);
            let id = parseInt(delete_bts[i].dataset.id);

            if(confirm("정말 삭제하시겠습니까?")){
                //storeData의 최신값 다시 가져오기
                storeData = localStorage.getItem("closet");

                if(storeData==null){
                    closet = [];
                }else{
                    closet=JSON.parse(storeData);
                }
                let newCloset = [];
                
                for(let a=0; a<closet.length; a++){
                    if(closet[a].id !== id){
                        newCloset.push(closet[a]); 
                    }
                }

                closet = newCloset;
                localStorage.setItem("closet", JSON.stringify(closet));
                renderCloset();
            }else{
                alert("삭제가 취소되었습니다.");
            }
        });
    }
}

function colorPalette(){
    let colorOptions = document.querySelectorAll(".color-option");

    for(let i=0; i<colorOptions.length; i++){
        colorOptions[i].addEventListener("click",() =>{
        
            //모든 옵션의 선택 표시 제거
            for(let j=0; j<colorOptions.length; j++){
                colorOptions[j].classList.remove("selected");
            }
            //클릭한 옵션만 선택 표시 추기
            colorOptions[i].classList.add("selected");

            // 선택된 색상 값을 hidden input에 저장 
            document.getElementById("color").value = colorOptions[i].dataset.color;
        });
    }
}

function renderForCoordi(){
    let coordiSpace = document.getElementById("coordiCloset");
    coordiSpace.innerHTML = "";

    storeData = localStorage.getItem("closet");
    if(storeData==null){    
        closet=[];
    } else {
        closet=JSON.parse(storeData);
    }

    for(let i=0; i<closet.length; i++){
        let item = closet[i];
        
        let card = document.createElement("div");
        card.className="coordi-card" // className: 중복 적용가능
        card.dataset.id = item.id;

        card.innerHTML = `<img src="${item.image}" alt="${item.name}" class="clothing-img">
        <p>${item.name}</p>`;
        card.addEventListener("click", function(){
            card.classList.toggle("selected"); //toggle 켜기/끄기 자동 전환
        });

        coordiSpace.appendChild(card);
    }
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

    //기존 저장된 코디 가져오기 (없으면 빈 배열)
    let coordiData = localStorage.getItem("coordiList");

        if(coordiData==null){
            coordiList=[];
        } else {
            coordiList=JSON.parse(coordiData);
        }
    
    //새 코디 조합 객체 만들기
    let newCoordi = {
        id : Date.now(),
        title : title,
        items : selectIds
    };
    
    coordiList.push(newCoordi);
    localStorage.setItem("coordiList", JSON.stringify(coordiList));

    alert("코디가 저장되었습니다!")
    
    //초기화 화면 보여주기
}

function renderCoordiList(){
    console.log("✅ renderCoordiList 실행됨!");
    let coordiContainer = document.getElementById("coordiList");
    coordiContainer.innerHTML="";

    let data = localStorage.getItem("coordiList");
    if(data==null){
        coordiContainer.innerHTML="<p>저장된 코디가 없습니다.</P>"
        return;
    }

    //옷장 데이터 불러와야 이미지 연결 가능
    let closetData = JSON.parse(localStorage.getItem(closet));
    let coordiList = JSON.parse(data);

    for(let i=0; i<coordiList.length; i++){
        let coordi = coordiList[i]; //코디 한 세트

        console.log(coordi);

        let coordiCard = document.createElement("div");
        coordiCard.className = "coordi-result";
        coordi.items
        //코디카드부터 다시하기!



    }
}