const db = require('../dbTools.js');
const collection = 'test01';

db.deleteAll(collection, (err,res) => {
  if (err) {
    throw err;
  }
  console.log(res.result);
  console.log("==================================================");
  
  let insertDatas = [
    {name:'jack',age:23},
    {name:'rose',age:12}
  ];
  db.insert(collection, insertDatas, (err,res) => {
    console.log(res.result);
    console.log("==================================================");
    
    db.update(collection, {name:'jack'}, {name:'marry'},
      (err,res) => {
        console.log(res.result);
        console.log("==================================================");
        
        db.find(collection, {name:'marry'}, (err,users) => {
          console.log(users);
        })
    })
  });
});


