import Configs from "./config"
import instance from "./request"

const loadRegions = function(){
    return instance.get(Configs.URL.Region)
}
const loadCenters = function(regionid){
    return instance.get(Configs.URL.Center+"?regionid="+regionid);
}
const countCenters = function(regionid){
    return instance.get(Configs.URL.CountCenter+"?regionid="+regionid);
}
const countClass = function(id,type){
    return instance.get(Configs.URL.CountClass+"?id="+id+"&type="+type);
}
const countStudents = function(id,type){
    return instance.get(Configs.URL.CountStudents+"?id="+id+"&type="+type);
}
const GetBaiGiao = function(classid,id,type,start,end){
    return instance.get(Configs.URL.BaiGiao+"?classid="+classid+"&id="+id+"&type="+type+"&start="+start+"&end="+end);
}
const Helper = {
    loadRegions,
    loadCenters,
    countCenters,
    countClass,
    countStudents,
    GetBaiGiao
}

export default Helper;