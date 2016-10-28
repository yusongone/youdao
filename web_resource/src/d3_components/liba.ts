/// <reference path='node_modules/testa.d.ts'/>

import "./test.less"

import {TestA,TestB} from  "ImportJS"

TestA.test({abc:"fe"});

TestB.what({abc:"fe"});





interface ABC{
    test:string
}

const c=(test:ABC)=>{

}

export {c};