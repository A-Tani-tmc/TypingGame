'use strict'
// 1行目に記載している 'use strict' は削除しないでください


let ctx = document.getElementById("myPieChart");
const typeInputElement2 = document.getElementById("typeInput"); //タイピングする領域の要素

drawPieChart ();

/* inputテキスト入力。合っているかどうかの判定 */////////////////////////////////
typeInputElement2.addEventListener("input", () => { //打ち込まれる毎に第二引数の関数が呼び出される
    drawPieChart ();
});

function drawPieChart (){

    let numOfMiss = Number(document.getElementById("miss").innerText);
    let numOfCorrect = Number(document.getElementById("total").innerText - numOfMiss);

    ctx = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ["SUCCESS", "MISS"],
            datasets: [{
                backgroundColor: [
                    "rgb(0, 195, 254)",
                    "red"
                ],
                data: [numOfCorrect, numOfMiss]
            }]
        },
        options: {
            responsive: false,
            title: {
                display: true,
                text: '正/誤割合'
            }
        }
    });
}
