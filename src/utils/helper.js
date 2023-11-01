import Configs from "./config"
import instance from "./request"

const loadRegions = function(){
    return instance.get(Configs.URL.Region)
}
const loadCenters = function(regionid){
    return instance.get(Configs.URL.Center+"?regionid="+regionid);
}
const loadClass = function(centerid){
    return instance.get(Configs.URL.Class+"?centerid="+centerid);
}

const loadStudents = function(id){
    return instance.get(Configs.URL.Student+"?id="+id);
}

const countCenters = function(regionid,start,end){
    return instance.get(Configs.URL.CountCenter+"?regionid="+regionid+"&start="+start+"&end="+end);
}
const countClass = function(id,type,start,end){
    return instance.get(Configs.URL.CountClass+"?id="+id+"&type="+type+"&start="+start+"&end="+end);
}
const countStudents = function(id,type,start,end){
    return instance.get(Configs.URL.CountStudents+"?id="+id+"&type="+type+"&start="+start+"&end="+end);
}
const GetBaiGiao = function(classid,id,type,start,end){
    return instance.get(Configs.URL.BaiGiao+"?classid="+classid+"&id="+id+"&type="+type+"&start="+start+"&end="+end);
}
const GetLink = function(id,start,end,level){
    if(level == "null" || level == null){
        level="";
    }
    return instance.get(Configs.URL.BaiLink+"?id="+id+"&start="+start+"&end="+end+"&level="+level);
}
const GetTuLuyen = function(classid,id,type,start,end){
    return instance.get(Configs.URL.TuLuyen+"?classid="+classid+"&id="+id+"&type="+type+"&start="+start+"&end="+end);
}
const Helper = {
    loadStudents,
    loadRegions,
    loadCenters,
    loadClass,
    countCenters,
    countClass,
    countStudents,
    GetBaiGiao,
    GetLink,
    GetTuLuyen
}

export default Helper;