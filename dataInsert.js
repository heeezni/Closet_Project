function insertSampleClothes() {
    let sampleImages = [
        {
            name: "슬리브리스",
            category: "상의",
            season: "여름",
            color: "화이트",
            path: "res/top.png"
        },
        {
            name: "카고바지",
            category: "하의",
            season: "",
            color: "카키",
            path: "res/pants.png"
        }
    ];

    for (let i = 0; i < sampleImages.length; i++) {
        let item = sampleImages[i];

        fetch(item.path)
            .then(function(res) {
                if (!res.ok) {
                    throw new Error("이미지 로딩 실패");
                }
                return res.blob();
            })
            .then(function(blob) {
                let file = new File([blob], item.name + ".png", { type: blob.type });

                let clothesItem = {
                    clothesname: item.name,
                    category: item.category,
                    season: item.season,
                    color: item.color,
                    image: file
                };

                let tx = db.transaction("clothes", "readwrite");
                let store = tx.objectStore("clothes");
                store.add(clothesItem);
            })
            .catch(function(error) {
                console.error("삽입 실패:", error);
            });
    }
}
