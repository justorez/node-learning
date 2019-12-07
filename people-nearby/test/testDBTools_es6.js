const db = require('../es6/dbTools.js');
const collection = 'test01';

let data = [
  {name:'jack',age:23},
  {name:'rose',age:12}
];

(async () => {
  try {
    await db.open();
    
    let res1 = await db.deleteAll(collection);
    console.log(res1.result);
    console.log("==================================================");
    
    let res2 = await db.insert(collection, data);
    console.log(res2.result);
    console.log("==================================================");
    
    let res3 = await db.update(collection, {name:'jack'}, {name:'marry'});
    console.log(res3.result);
    console.log("==================================================");
    
    let res4 = await db.find(collection, {name:'marry'});
    console.log(res4);
    
  } catch(e) {
    console.log(e);
    
  } finally {
    db.close();
  }
})();
