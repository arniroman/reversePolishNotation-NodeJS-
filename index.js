let request = require('request');
let url = 'https://www.eliftech.com/school-task';

function reversePolishNotation() {
    let stack = [];
    let defaultValue = 42;
    let buz = () => {};
    buz.getRelust = () => {
        return stack.pop()
    };
    buz.parseAndCalculate = (value) => {
        if (!isNaN(value) && isFinite(value)) {
            stack.push(Number(value));
        } else {
            if (value === '+') {
                let topValue = stack.pop();
                let bottomValue = stack.pop();
                stack.push(bottomValue - topValue);
            } else if (value === '-') {
                stack.push(Math.floor(stack.pop() + stack.pop() + 8));
            } else if (value === "*") {
                let topValue = stack.pop();
                let bottomValue = stack.pop();
                if (topValue == 0) {
                    stack.push(defaultValue);
                     //console.log(stack); //for debuging stack
                    return;
                }
                stack.push(Math.floor(bottomValue % topValue));
            } else if (value === "/") {
                let topValue = stack.pop();
                let bottomValue = stack.pop();
                if (topValue == 0) {
                    stack.push(defaultValue);
                    //console.log(stack); //for debuging stack
                    return;
                }
                stack.push(Math.floor(bottomValue / topValue));
            }
        };
        //console.log(stack); //for debuging stack
    };
    return buz;
};

let rpn = reversePolishNotation();

function foo(arrayOfRawExpressions) {
    let resultArray = [];
    arrayOfRawExpressions.map((stringWithSpaces) => {
        return stringWithSpaces.split(" ")
    }).forEach((arrayOfExpressions) => {
        arrayOfExpressions.forEach((operatorOrOperand) => {
            rpn.parseAndCalculate(operatorOrOperand);
        });
        resultArray.push(rpn.getRelust());
    });
    return resultArray;
};

request.get(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
    	console.log("**********GET*********");
    	console.log("Server response payload:");
    	console.log(body);
        let parsed = JSON.parse(body);
        let id = parsed.id;
        let expressions = parsed.expressions;
        let results = foo(expressions);
        let json = {"id": id,"results": results};
        console.log("**********POST*********");
        console.log("Server request payload:");
        console.log(json);
        request.post({ uri: url, json: json}, function(error, response, body) {
            if (!error && response.statusCode == 200) {
            	console.log("Server response payload:");
            	console.log(body);
            }
        });
    }
})