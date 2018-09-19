//express 모듈 불러온 후 express 변수에 저장
var express = require('express');

//http 모듈 불러온 후 http 변수에 저장
var http = require('http');

//body-parser 모듈 불러온 후 bodyParser 변수에 저장
var bodyParser = require('body-parser');

//express 객체를 app 변수에 저장
var app = express();
var Client = require('mongodb').MongoClient;

//mongoose
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var dbUrl = "mongodb://ldcc:1234@localhost:27017/project_todo";

mongoose.connect(dbUrl);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',function(){
    console.log("we're connected!");
});

//schema
var todoSchema = mongoose.Schema({
    date:Date,
    task:String,
    done:Boolean
});
var todo = mongoose.model("todo",todoSchema,'testCollection');

//test
    todo.find({},function(err,docs){
        console.log(docs);
        console.log("hi");
    });


//body-parser 미들웨어 사용
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//http://서버주소/keyboard
app.get('/keyboard', function(req, res){
    //전달할 데이터
    var data = {
        'type': 'buttons',
        'buttons' : ['예약하기', '등록하기', '시간예약','정보', '정보', '정보', '정보','정보','정보','정보','정보','정보','정보','정보','정보','정보','정보','정보','정보','정보','정보']
    };

    //JSON 형식으로 응답
    res.json(data);
});

// http://서버주소/message
app.post('/message', function(req, res){
    //유저 개인식별 키
    var user_key = req.body.user_key;
    
    //유저가 입력한 데이터
    var msg = req.body.content;
    console.log('전달받은 메시지: '+ msg);

    var send = {}; //응답할 데이터

    switch(msg){
        case '예약하기':
            send = {
                'message':{
                    'text': '저는 예약 주문을 도와주는 챗봇입니다.\n예약을 위하여 위치를 선택해주세요.'   
                },
                keyboard: {
                    'type' : 'buttons',
                    'buttons': [
                        '내 지역으로 검색',
                        '키워드로 검색',
                        '최근 이용 매장',
                    ]
                }
            }
            break;

        case '등록하기':
            send = {
                'message':{
                    'text': '등록하기를 선택했습니다.',
                    'message_button':{
                        'label':'등록하기 챗봇으로 이동합니다.',
                        'url':'naver.com'// 추후에 등록하기 챗봇 추천
                    }   
                }
            }
            break;

        case '정보':
            send = {
                'message':{
                    'text': '음식 예약 싸이트를 만드는 중입니다.'   
                },
                keyboard: {
                    'type' : 'buttons',
                    'buttons': ['테스트1', '테스트2']
                }
            }
            break;

	case '시간예약':
            send = {
                'message':{
                    'text': '음식 예약 싸이트를 만드는 중입니다.'
                },
                keyboard: {
                    'type' : 'buttons',
                    'buttons': ['09:00~10:00','10:00~11:00','11:00~12:00','12:00~13:00','13:00~14:00','14:00~15:00','15:00~16:00','16:00~17:00','17:00~18:00','18:00~19:00','19:00~20:00','20:00~21:00','21:00~22:00','22:00~23:00']
                }
            }
            break;


        default:
            send = {
                'message' : {
                    'text': '알 수 없는 명령입니다!'
                }
            }
        break;
    }

    res.json(send);
});


// 9090포트로 서버 실행
http.createServer(app).listen(9090, function(){
    console.log('서버 실행 중..');
});

