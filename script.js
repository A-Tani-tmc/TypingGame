'use strict'
// 1行目に記載している 'use strict' は削除しないでください

const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random"; //表示する文章を取得
const typeDisplayElement = document.getElementById("typeDisplay"); //文章が表示される要素
const typeInputElement = document.getElementById("typeInput"); //タイピングする領域の要素
const timer = document.getElementById("timer"); //タイマー
const numberOfSentence = document.getElementById("numberOfSentence"); //文字数表示領域の要素

RenderNextSentence(); //次のランダムな文章を取得する

let countMissType = 0; //ミスタイプ数
const IdOfountMissType = document.getElementById("miss");
let countTotalType = 0; //総タイプ数
const IdOfcountTotalType = document.getElementById("total");
let correctTypeRate = 0; //正答率
const IdOfcorrectTypeRate = document.getElementById("rate");
let complete = 0; //クリア数
const IdOfComplete = document.getElementById("complete");


/* サウンドを付ける */
const wrongSound = new Audio("audio_wrong.mp3");
const correctSound = new Audio("audio_correct.mp3");
const typeSound = new Audio("audio_typing-sound.mp3");


/* inputテキスト入力。合っているかどうかの判定 */////////////////////////////////
typeInputElement.addEventListener("input", () => { //打ち込まれる毎に第二引数の関数が呼び出される
    countTotalType++; //総タイピング数をカウント

    /* タイプ音をつける */
    typeSound.volume = 0.1; //音量
    typeSound.play(); //音を鳴らす
    typeSound.currentTime = 0; //再生開始位置に戻す

    /* 文字と文字を比較する */
    const sentence = typeDisplayElement.querySelectorAll("span"); //ディスプレイに表示されているSpanタグを取得
    const arrayValue = typeInputElement.value.split(""); //打ち込んだテキストを1文字毎に分割して配列に格納

    let correct = true; //表示される文章の文字が入力値と等しいかどうかを判定するフラグ
    let flagOfOverIndex = 0; //入力数が表示文章を超えた場合に利用

    sentence.forEach((characterSpan, index) => { //与えられた関数を、配列の各要素に対して一度ずつ実行。index:添字
        if (arrayValue[index] == null) { //何も打ち込んでいない場合
            characterSpan.classList.remove("correct"); //所属するツリーから要素を削除
            characterSpan.classList.remove("incorrect"); //所属するツリーから要素を削除
            correct = false;

        } else if (characterSpan.innerText == arrayValue[index]) { //文章の文字 ＝ 入力の場合
            characterSpan.classList.add("correct"); //色替え。指定した値を持つ新しい要素を対象オブジェクトの末尾に追加
            characterSpan.classList.remove("incorrect"); //所属するツリーから要素を削除
            IdOfcountTotalType.innerText = countTotalType; //総タイピング数を表示

        } else { //文章の文字 !＝ 入力の場合
            characterSpan.classList.add("incorrect"); //色替え。指定した値を持つ新しい要素を対象オブジェクトの末尾に追加
            characterSpan.classList.remove("correct"); //所属するツリーから要素を削除
            correct = false;


            if (arrayValue.length - 1 === index) { //最後の要素に注目
                countMissType++; //タイピングミス数をカウント
                wrongSound.volume = 0.1; //音量
                wrongSound.play(); //音を鳴らす
                wrongSound.currentTime = 0; //再生開始位置に戻す
            } else if (arrayValue.length > numberOfSentence.innerText) { //入力数が表示文章を超えた場合
                if (flagOfOverIndex === 0) {
                    countMissType++; //タイピングミス数をカウント
                    flagOfOverIndex++;
                }
            }

            IdOfcountTotalType.innerText = countTotalType; //総タイピング数を表示
            IdOfountMissType.innerText = countMissType; //タイピングミス数を表示
        }
        IdOfcorrectTypeRate.innerText = Math.round(((countTotalType - countMissType) * 100 / countTotalType) * 100) / 100 + "%"; //正答率を表示
    });

    /* 入力が完了すれば次の文章を表示 */
    if (correct) { //correct = trueで入力完了した場合
        complete++; //クリア数を加算
        IdOfComplete.innerText = complete;
        correctSound.volume = 0.1; //音量
        correctSound.play(); //音を鳴らす
        correctSound.currentTime = 0; //再生開始位置に戻す
        RenderNextSentence(); //次のランダムな文章を取得
    }
});


/* thenかawaitで待たないと欲しいデータが入らないため非同期でランダムな文章を取得する */////////////////////////////////
function getRandomSentence() {
    return fetch(RANDOM_SENTENCE_URL_API) //リクエストを送信
        .then((response) => response.json()) //response: リクエストのレスポンス。ストリームを取得して完全に読み取る。
        .then((data) => data); //レスポンスデータを取得。オブジェクトで返される。
}


/* 次のランダムな文章を取得する */////////////////////////////////
async function RenderNextSentence() { //非同期関数
    const sentence = await getRandomSentence();
    /* ディスプレイに表示 */
    typeDisplayElement.innerText = ""; //最初はsentenceが入る。

    /* 文章(sentenceのcontentキーを持つ要素)を1文字ずつ分解して、spanタグを生成する */
    sentence.content.split("").forEach((character) => {
        const characterSpan = document.createElement("span");
        characterSpan.innerText = character;
        typeDisplayElement.appendChild(characterSpan);
    });
    /* テキストボックスの中身を消す。 */
    typeInputElement.value = null;
    console.log("Sentence: ", sentence.content, "\nAuthor: ", sentence.author); //テキストボックスの中身表示
    numberOfSentence.innerText = sentence.length;

    /* タイマーのリセット */
    StartTimer();

    /* アニメーションの表示 */
    animation()
}

let startTime; //文字が新たに表示された時の時刻
let originTime = 30; //タイマーの最大値


/* カウントアップを開始する */////////////////////////////////
function StartTimer() {
    timer.innerText = originTime; //タイマー表示(初期値として)
    startTime = new Date(); //現在の時刻を表示

    /* () => {}  アロー関数 function(){} と同じ*/
    const count = setInterval(() => { //一定の遅延間隔を置いて関数をを繰り返し呼び出す
        timer.innerText = originTime - getTimerTime(); //１秒ずれて呼び出される
        // console.log(new Date()); //現在の時刻（確認用）
        if (timer.innerText <= 0) {
            timeUp(); //時間切れ
            clearInterval(count); //setIntervalの処理を停止
        }
    }, 1000); //1000ミリ秒毎に処理を繰り返す
}


/* 開始時からの経過時間 */////////////////////////////////
function getTimerTime() {
    return Math.floor(
        (new Date() - startTime) / 1000
    ); /* 現在の時刻 - １秒前の時刻 = 1s*/
}


/* 時間切れ時の処理 *///////////////////////////////////////
function timeUp() {
    RenderNextSentence();
}


/* 文字を動かすアニメーション */////////////////////////////////
function animation() {
    const move = document.getElementsByTagName("img");
    move[0].animate(
        [{ transform: "translateX(0%)" }, { transform: "translateX(800%)" }],
        { duration: originTime * 1000, fill: "forwards" }
    );
    setTimeout(function () {
        move[1].animate(
            [{ transform: "translateX(0%)" }, { transform: "translateX(800%)" }],
            { duration: originTime * 1000, fill: "forwards" }
        )
    }, originTime * 160);

    setTimeout(function () {
        move[2].animate(
            [{ transform: "translateX(0%)" }, { transform: "translateX(800%)" }],
            { duration: originTime * 1000, fill: "forwards" }
        )
    }, originTime * 160 * 2);

    setTimeout(function () {
        move[3].animate(
            [{ transform: "translateX(0%)" }, { transform: "translateX(800%)" }],
            { duration: originTime * 1000, fill: "forwards" }
        )
    }, originTime * 160 * 3);

    setTimeout(function () {
        move[4].animate(
            [{ transform: "translateX(0%)" }, { transform: "translateX(800%)" }],
            { duration: originTime * 1000, fill: "forwards" }
        )
    }, originTime * 160 * 4);

    setTimeout(function () {
        move[5].animate(
            [{ transform: "translateX(0%)" }, { transform: "translateX(800%)" }],
            { duration: originTime * 1000, fill: "forwards" }
        )
    }, originTime * 160 * 5);
}
