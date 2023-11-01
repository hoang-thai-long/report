<template>
    <div class="container-fluid">
        <div class="filter">
            <div class="filter-box">
                <div class="filter-item">
                    <filter-date @change-value="changeFilterDate"></filter-date>
                </div>
                <br>
                <div class="filter-item">
                    <div class="row">
                        <filter-option @change-value="changeFilterRegion" :placeholder="'chọn khu vực'" class="col" track-by="id" label="name" :data="regions"></filter-option>
                        <filter-option @change-value="changeFilterCenter" :placeholder="'chọn trường'" class="col" track-by="id" label="name" :data="centers"></filter-option>
                        <filter-option :placeholder="'chọn cấp'" class="col" track-by="id" label="name" :data="levels"></filter-option>
                        <filter-option @change-value="changeFilterClass" :placeholder="'chọn lớp'" class="col" track-by="id" label="name" :data="listClass"></filter-option>
                        <div class="col-1"><button type="button" class="btn btn-search btn-primary" v-on:click="applySearch">Xem báo cáo</button></div>
                    </div>
                </div>
            </div>
        </div>
        <hr>
        <div class="data-table">
            <progress-loading :data-value="((PercentLoading/CountData)*100).toFixed(0)" v-if="((PercentLoading/CountData)*100).toFixed(0) < 100"></progress-loading>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th rowspan="2">STT</th>
                        <th rowspan="2">Tên</th>
                        <th :colspan=" filter.class == null ? 4 : 3">Tổng hợp</th>
                        <th colspan="4">Bài kiểm tra</th>
                        <th colspan="4">Bài luyện tập</th>
                        <th colspan="4">Bài qua link</th>
                    </tr>
                    <tr>
                        <th>Điểm</th>
                        <th>Thời gian</th>
                        <th v-if="filter.class == null">TLTG</th>
                        <th>SL</th>

                        <th>Điểm</th>
                        <th>Thời gian</th>
                        <th>TLTG</th>
                        <th>SL</th>

                        <th>Điểm</th>
                        <th>Thời gian</th>
                        <th>TLTG</th>
                        <th>SL</th>

                        <th>Điểm</th>
                        <th>Thời gian</th>
                        <th>TLTG</th>
                        <th>SL</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,i) in DataShow" :key="i" v-on:click="getDetails(item.id,0)">
                        <td>{{ (i+1) }}</td>
                        <td style="text-align: left; width: 250px; text-overflow: ellipsis;">{{ item.name }}</td>
                        <td>{{ totalPoint(item.id,0,3) }}</td>
                        <td>{{ totalTime(item.id,0,3) }}</td>
                        <td v-if="filter.class == null">
                            <p style="text-align: left;">Trường :    {{ totalSchool(item.id,0) }}</p>
                            <p style="text-align: left;">Lớp :       {{ totalClassActive(item.id,0,3) }}/{{ totalClass(item.id,0) }}</p>
                            <p style="text-align: left;">Học sinh :  {{ totalStudentActive(item.id,0) }}/{{ totalStudent(item.id,0) }}</p>
                        </td>
                        <td>{{ totalLesson(item.id,0,3) }}</td>

                        <td>{{ totalPoint(item.id,0,0) }}</td>
                        <td>{{ totalTime(item.id,0,0) }}</td>
                        <td v-if="filter.class == null">{{ totalStudentActive(item.id,0,0) }}/{{ totalStudent   (item.id,0) }}</td>
                        <td v-else>{{ tyleLamBai(item.id,0) }}</td>
                        <td>{{ totalLesson(item.id,0,0) }}</td>
                        
                        <td>{{ totalPoint(item.id,0,1) }}</td>
                        <td>{{ totalTime(item.id,0,1) }}</td>
                        <td v-if="filter.class == null">{{ totalStudentActive(item.id,0,1) }}/{{ totalStudent   (item.id,0) }} </td>
                        <td v-else>{{ tyleLamBai(item.id,1) }}</td>
                        <td>{{ totalLesson(item.id,0,1)  }}</td>

                        <td>{{ totalPointLink(item.id) }}</td>
                        <td>{{ totalTimeLink (item.id) }}</td>
                        <td v-if="filter.class == null">{{ totalStudentLinkActive(item.id) }}/{{ totalStudentLink(item.id) }} </td>
                        <td v-else>{{ tyleLamBaiLink(item.id) }}</td>
                        <td>{{ totalLink(item.id) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- <modal name="modal-view-details">view-details</modal> -->
    </div>
    
</template>
<script>
import { defineComponent } from 'vue'
import FilterDate from '../components/filters/FilterDate.vue'
import FilterOption from '../components/filters/FilterOption.vue'
import Helper from '../utils/helper'
import ProgressLoading from './ProgressLoading.vue'
export default defineComponent({
    name:'report-table',
    components:{FilterDate,FilterOption,ProgressLoading},
    mounted(){
        this.loadRegions();
    },
    data(){
        return {
            CountData:0,
            PercentLoading:0,
            DataShow:[],
            DataLink:[],
            DataTuLuyen:[],
            DataGiaoBai:[],
            ListClassData:[],
            DataCountStudents:[],
            DataLoadDing:{
                Center:[],
                Class:[],
                Student:[]
            },
            DataCountCenter:[],
            DataCountClass:[],
            filter:{
                region:null,
                center:null,
                level:null,
                class:null,
            },
            start:null,
            end:null,
            regions:[],
            centers:[],
            listClass:[],
            levels:[],
            students:[]
        }
    },
    methods:{
        tyleLamBai(id,type){
           var data = this.DataGiaoBai.find(o=>o.parent == id);
           console.log(data, id, type, this.DataGiaoBai);
           if(data != null){
               var x = type == 1 ? data.tyLeThamGia.filter(o=>o.templateType == 1 && o.points.length > 0) : data.tyLeThamGia.filter(o=>o.templateType != 1 && o.points.length > 0);
               if(x != null){
                    return x.length+"/"+ type == 1 ? data.totalLT  : data.totalKT
               }
           }
           return "--/--";
        },
        tyleLamBaiLink(id){
            console.log(id);
        },
        totalPointLink(id){
            var data = this.DataLink.find(o=>o.regionid == id);
            if(data && data.data){
                return data.data.points.toFixed(1);
            }
            return "---";
        },
        totalTimeLink(id){
            var data = this.DataLink.find(o=>o.regionid == id);
            if(data && data.data){
                return data.data.times.toFixed(1);
            }
            return "---";
        },
        totalStudentLinkActive(id){
            var data = this.DataLink.find(o=>o.regionid == id);
            if(data && data.data){
                return data.data.studentDo;
            }
            return "---";
        },
        totalStudentLink(id){
            var data = this.DataLink.find(o=>o.regionid == id);
            if(data && data.data){
                return data.totalStudents;
            }
            return "---";
        },
        totalLink(id){
            var data = this.DataLink.find(o=>o.regionid == id);
            if(data && data.data){
                return data.data.totalLink;
            }
            return "---";
        },
        getDetails(id,type){
            console.log(id,type);
            this.$modal.show("modal-view-details");
        },
        onlyUnique(value, index, array) {
            return array.indexOf(value) === index;
        },
        totalStudentActive(id,type,template){
            console.log(type);
            var data =this.DataGiaoBai.filter(o=>o.parent == id && o.totalLesson > 0 && o.tyLeThamGia.length > 0);
            if(data != null){
                var studentKT = [];
                var studentLT = [];
                data.forEach(item=>{
                    studentKT = [].concat(studentKT,item.studentDoKt)
                    studentLT = [].concat(studentLT,item.studentDoLt)
                })
                if(template == 0) return studentKT.length;
                if(template == 1) return studentLT.length;
                return  [].concat(studentKT,studentLT).length;
            }
            
            return 0;
        },
        totalClassActive(id,type){
            console.log(type);
            var data =this.DataGiaoBai.filter(o=>o.parent == id && o.totalLesson > 0);
            if(data) return data.length

            return 0;
        },
        totalSchool    (id,type){
            console.log(type);
            var item = this.DataCountCenter.find(o=>o.id==id);
            if(item) return item.value;
            return 0;
        },
        totalClass     (id,type){
            console.log(type);
            var item = this.DataCountClass.find(o=>o.id==id);
            if(item) return item.value;
            return 0;
        },
        totalStudent   (id,type){
            console.log(type);
            var item = this.DataCountStudents.find(o=>o.id==id);
            if(item) return item.value;
        },
        totalLesson(id,type,template){
            var data = this.DataGiaoBai.filter(o=>o.parent == id && o.totalLesson > 0);
            if(data && data.length > 0){
                
                if(template == 0){
                    var kt = data.map(o=>o.totalKT).reduce((a,b)=>a+b,0);
                    return kt;
                } 
                if(template == 1) {
                    var lt = data.map(o=>o.totalLT).reduce((a,b)=>a+b,0);
                    return lt;
                }
                var tt = data.map(o=>o.totalLesson).reduce((a,b)=>a+b,0);
                return tt;
            }
            console.log(id,type);
            return 0;
        },
        totalPoint(id,type,template){
            var data =this.DataGiaoBai.filter(o=>o.parent == id && o.totalLesson > 0);
            if(data != null && data.length > 0){
                var ktpoints = (data.map(o=>o.ktPoints).reduce((a,b)=>a+b,0)/data.length).toFixed(1);
                if(template == 0) return ktpoints;
                var ltPoints = (data.map(o=>o.ltPoints).reduce((a,b)=>a+b,0)/data.length).toFixed(1);
                if(template == 1) return ltPoints;
                return ktpoints+"/"+ltPoints;
            }
            console.log("totalPoint",type);
            return "--/--";
        },
        totalTime(id,type,template){
            console.log("totalTime",type);
            var data =this.DataGiaoBai.filter(o=>o.parent == id && o.totalLesson > 0);
            if(data != null && data.length > 0){
                var kt = (data.map(o=>o.ktTimes).reduce((a,b)=>a+b,0)/data.length).toFixed(1);
                if(template == 0) return kt;
                var lt = (data.map(o=>o.ltTimes).reduce((a,b)=>a+b,0)/data.length).toFixed(1);
                if(template == 1) return lt;
                return kt+"/"+lt;
            }
            return 0;
        },
        applySearch(){
            this.CountData = 0;
            const that = this;
            that.PercentLoading = 0;
            if(this.filter.class){
                console.log("filter - class")
                this.DataShow = this.students;
                const data = [].concat([],this.students);
                that.CountData = data.length;
                data.forEach(o=>{
                    this.loadBaiGiao(this.filter.class.id,o.id,3).then(res=>{
                        that.DataGiaoBai.push(res.data); that.PercentLoading++;
                    });
                })
            }
            else{
                
                if(this.filter.center){
                    this.ListClassData = [];
                    this.DataCountClass = [];
                    this.DataCountStudents = [];
                    that.DataShow = this.listClass;
                        const data = [].concat([],this.listClass);
                        data.forEach(o=>{
                            that.countStudents(o.id,2);
                            that.loadLinkWithCenter(o.id);
                        });
                }
                else{
                    if(this.filter.region)
                    {
                        console.log("filter - region")
                        this.ListClassData = [];
                        this.DataCountClass = [];
                        this.DataCountStudents = [];

                        that.DataShow = this.centers;
                        const data = [].concat([],this.centers);
                        data.forEach(o=>{
                            that.countClass(o.id,1);
                            that.countStudents(o.id,1);
                            that.loadLinkWithCenter(o.id);
                        });
                    }
                    else{
                        
                        that.DataShow = this.regions;
                        this.DataCountStudents = [];
                        this.DataCountCenter = [];
                        this.DataCountClass = [];
                        this.DataLoadDing = {
                            Center:[],
                            Class:[],
                            Student:[]
                        }
                        this.DataGiaoBai = [];
                        const data = [].concat([],this.regions);
                        data.forEach(o=>{
                            that.countCenters(o.id,0)
                            that.countClass(o.id,0)
                            that.countStudents(o.id,0)
                            that.loadLinkWithClass(o.id);
                        });
                    }
                }
            }
        },
        loadLinkWithCenter(centerid){
            console.log(centerid);
        },
        loadRegions(){
            this.CountData++;
            const that = this;
            Helper.loadRegions().then(res=>{
                that.regions = res.data;
                that.PercentLoading++;
            })
        },
        changeFilterClass : function(value){
            if(value != this.filter.center){
                this.filter.class = value;
            }
            if(value){
                const that = this;
                Helper.loadStudents(value.id).then(res=>{
                    that.students = res.data;
                })
            }
        },
        changeFilterCenter : function(value){
            if(value != this.filter.center){
                this.filter.center = value;
            }
            if(value){
                const that = this;
                Helper.loadClass(value.id).then(res=>{
                    that.listClass = res.data;
                })
            }else{
                this.filter.center = null;
                this.filter.class = null;
            }
        },
        changeFilterRegion : function(value){
            if(value != this.filter.region){
                this.filter.region = value;
            }
            if(value){
                const that = this;
                Helper.loadCenters(value.id).then(res=>{
                    that.centers = res.data;
                    
                })
            }
            else{
                // this.DataShow = [].concat([],this.regions); 
                this.filter.center = null;
                this.filter.level = null;
                this.filter.class = null;
            }
        },
        countCenters : function(id){
            this.CountData++;
            const that = this;
            if(this.DataCountCenter != null && this.DataCountCenter.find(o=>o.id == id) != undefined){
                this.PercentLoading++;
                return this.DataCountCenter.find(o=>o.id == id).value;
            }
            else{
                if(this.DataLoadDing.Center.find(o=>o.id == id) != undefined) return '<div> đang load </div>';
                this.DataLoadDing.Center.push({id:id});
                var result = Helper.countCenters(id,this.start,this.end);
                result.then(res=>{
                    that.PercentLoading++;
                    that.DataCountCenter.push({id:id,value:res.data});
                    that.DataLoadDing.Center.splice(that.DataLoadDing.Class.findIndex(o=>o.id == id),1);
                })

                return '<div>...</div>'; 
            }
        },
        countClass : function(id,type){
            this.CountData++;
            const that = this;
            if(this.DataCountClass != null && this.DataCountClass.find(o=>o.id == id) != undefined) {
                that.PercentLoading++;
                return this.DataCountClass.find(o=>o.id == id).value;
            }
            else{
                if(this.DataLoadDing.Class.find(o=>o.id == id && o.type == type) != undefined) return '<div> đang load </div>';
                this.DataLoadDing.Class.push({id:id,type:type});
                var result = Helper.countClass(id,type,this.start,this.end);
                result.then(res=>{
                    that.PercentLoading++;
                    that.DataCountClass.push({id:id,value:res.data.n});
                    that.DataLoadDing.Class.splice(that.DataLoadDing.Class.findIndex(o=>o.id == id && o.type == type),1);
                    that.ListClassData.push({id:id,type:type,l:res.data.l});
                    that.loadBaiGiaoWithClass(res.data.l,id,type,0);
                })
                return '<div>...</div>'
            }
        },
        loadLinkWithClass : function(id){
            this.CountData++;
            const that = this;
            that.loadLink(id)
                .then(res=>{ that.DataLink.push(res.data); this.PercentLoading++;})
                .catch(err=>{console.log(err);})
        },

        loadBaiGiaoWithClass : function(listClass,id,type,i){
            const that = this;
            if(listClass != null && listClass.length > 0 && i < listClass.length)
            {
                if(i == 0){
                    this.CountData += listClass.length;
                }
                that.loadBaiGiao(listClass[i],id,type)
                .then(res=>{ that.DataGiaoBai.push(res.data); that.PercentLoading++;})
                .catch(err=>{console.log(err);})
                .finally(()=>{
                    if(i < listClass.length){
                        i++;
                        return that.loadBaiGiaoWithClass(listClass,id,type,i);
                    }
                });
            }
        },
        loadBaiGiao : function(classid,id,type){
            return Helper.GetBaiGiao(classid,id,type,this.start,this.end);
        },
        loadLink : function(id){
            return Helper.GetLink(id,this.start,this.end,this.filter.level);
        },
        countStudents : function(id,type){
            this.CountData++;
            const that = this;
            if(this.DataCountStudents != null && this.DataCountStudents.find(o=>o.id == id) != undefined) {
                this.PercentLoading++;
                return this.DataCountStudents.find(o=>o.id == id).value;
            }
            else{
                if(this.DataLoadDing.Student.find(o=>o.id == id && o.type == type) != undefined) return '<div> đang load </div>';
                this.DataLoadDing.Student.push({id:id,type:type});
                var result = Helper.countStudents(id,type,this.start,this.end);
                result.then(res=>{
                    const data ={id:id,value:res.data};
                    that.DataCountStudents.push(data);
                    that.DataLoadDing.Student.splice(that.DataLoadDing.Student.findIndex(o=>o.id == id && o.type == type),1);
                    this.PercentLoading++;
                    return data;
                })
                return '<div>...</div>'
            }
        },
        changeFilterDate : function(date){
            if(date && date.length > 1 && date[0] && date[1]){
                this.start = date[0].getFullYear()+"-"+(date[0].getMonth()+1)+"-"+date[0].getDate();
                this.end = date[1].getFullYear()+"-"+(date[1].getMonth()+1)+"-"+date[1].getDate();
            }
            else{
                this.start = null;
                this.end = null;
            }
        }
    }
})

</script>