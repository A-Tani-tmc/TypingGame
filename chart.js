let ctx = document.getElementById("myPieChart");
let numOfMiss = document.getElementById("miss").innerText;
let numOfCorrect = document.getElementById("total").innerText - numOfMiss;

console.log("AAAAA", numOfCorrect, numOfMiss);

let myPieChart = new Chart(ctx, {
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
    title: {
      display: true,
      text: '正/誤割合'
    }
  }
});