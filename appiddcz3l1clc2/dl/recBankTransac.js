var mongoose =require('./db_conn.js');
var Schema = mongoose.Schema;

var obj = { //定义结构,结佣金流水
  userId:{ type: String, required:true},         //推荐用户的用户id
  recRecords:[String],                           //对应的推荐记录_id
  cardNo:{ type: String, required:true},         //银行卡号
  bankName:{ type: String, required:true},       //开户行
  trueName::{ type: String, required:true},      //真实姓名
  idNumber:{ type: String, required:true},        //身份证号码
  status:{type: Number, default:1},               //1表示待审核 2表示不通过 3表示已经发放
  comment:{ type: String, default:''},         //管理员审核留言
  writeTime:{ type: Date, default: function(){return Date.now()}}, //录入时间
}

var objSchema = new Schema(obj);

objSchema.statics.findOneByObj = function(obj,cb){
      var obj = obj || {};
      return this.findOne(obj, cb);
}

objSchema.statics.findByObj = function(obj,cb){
      var obj = obj || {};
      return this.find(obj, cb);
}

objSchema.statics.findAll = function (obj,skip,pagesize,cb) { 
       return this.find(obj)
             .limit(pagesize)
             .skip(skip)
             .sort({"_id":-1})
             .exec(cb);
}

objSchema.statics.countAll = function (obj,cb) { 
       return this.count(obj, cb);
}

objSchema.statics.createOneOrUpdate = function (query, update, cb) { 
    return this.findOneAndUpdate(query, update, {"upsert":true}, cb); 
}

objSchema.statics.destroy = function (query, cb) { 
    return this.remove(query, cb); 
}

module.exports = mongoose.model('wxPrize', objSchema);