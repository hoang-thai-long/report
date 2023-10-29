<template>
    <div class="container-fluid">
        <div class="filter">
            <div class="filter-box">
                {{ start?.year }} - {{ end?.month }}
                <div class="filter-item">
                    <filter-date @change-value="changeFilterDate"></filter-date>
                </div>
                <br>
                <div class="filter-item">
                    <div class="row">
                        <filter-option @change-value="changeFilterRegion" :placeholder="'chọn khu vực'" class="col" track-by="id" label="name" :data="regions"></filter-option>
                        <filter-option :placeholder="'chọn trường'" class="col" track-by="id" label="name" :data="centers"></filter-option>
                        <filter-option :placeholder="'chọn cấp'" class="col" track-by="id" label="name" :data="levels"></filter-option>
                        <filter-option :placeholder="'chọn lớp'" class="col" track-by="id" label="name" :data="listClass"></filter-option>
                        <div class="col"><button type="button" class="btn btn-search" v-on:click="applySearch">Tìm kiếm</button></div>
                    </div>
                </div>
            </div>
        </div>
        <hr>
        <div class="data-table">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th rowspan="2">STT</th>
                        <th rowspan="2">Tên</th>
                        <th colspan="4">Tổng hợp</th>
                        <th colspan="4">Bài giao</th>
                        <th colspan="4">Bài tự luyện</th>
                        <th colspan="4">Bài qua link</th>
                    </tr>
                    <tr>
                        <th>Trường</th>
                        <th>Lớp</th>
                        <th>học sinh</th>
                        <th>TLTG</th>

                        <th>Bài giao</th>
                        <th>Điểm tb</th>
                        <th>Thời gian tb</th>
                        <th>TLTG</th>

                        <th>Bài giao</th>
                        <th>Điểm tb</th>
                        <th>Thời gian tb</th>
                        <th>TLTG</th>

                        <th>Bài giao</th>
                        <th>Điểm tb</th>
                        <th>Thời gian tb</th>
                        <th>TLTG</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,i) in regions" :key="i">
                        <td>{{ (i+1) }}</td>
                        <td style="text-align: left; width: 250px; text-overflow: ellipsis;">{{ item.name }}</td>
                        <td v-if="DataCountCenter != null && DataCountCenter.find(o=>o.id==item.id) != undefined">{{ DataCountCenter.find(o=>o.id==item.id).value }}</td>
                        <td v-else v-html="countCenters(item.id)"></td>
                        <td v-if="DataCountClass != null && DataCountClass.find(o=>o.id==item.id) != undefined">{{ DataCountClass.find(o=>o.id==item.id).value }}</td>
                        <td v-else v-html="countClass(item.id,0)"></td>
                        <td v-if="DataCountStudents != null && DataCountStudents.find(o=>o.id==item.id) != undefined">{{ DataCountStudents.find(o=>o.id==item.id).value }}</td>
                        <td v-else v-html="countStudents(item.id,0)"></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue'
import FilterDate from '../components/filters/FilterDate.vue'
import FilterOption from '../components/filters/FilterOption.vue'
import Helper from '../utils/helper'
export default defineComponent({
    name:'report-table',
    components:{FilterDate,FilterOption},
    mounted(){
        this.loadRegions();
    },
    watch:{
        "end":function(o,v){
            console.log(o,v);
        }
    },
    data(){
        return {
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
            levels:[]
        }
    },
    methods:{
        applySearch(){
            const that = this;
            if(this.filter.class){
                console.log("filter - class")
            }
            else{
                
                if(this.filter.center){
                    console.log("filter - center")
                }
                else{
                    if(this.filter.region)
                    {
                        console.log("filter - region")
                    }
                    else{
                        if(this.ListClassData.length > 0){
                            this.ListClassData.forEach(o=>{
                                that.loadDataByClass(o.l,o.id,o.type,0);
                            });
                        }
                    }
                }
            }
        },
        loadRegions(){
            const that = this;
            Helper.loadRegions().then(res=>{
                that.regions = res.data;
            })
        },
        changeFilterRegion : function(value){
            if(value != this.filter.regions){
                this.filter.region = value;
            }
            if(value){
                const that = this;
                Helper.loadCenters(value.id).then(res=>{
                    that.centers = res.data;
                })
            }
            else{
                this.filter.center = null;
                this.filter.level = null;
                this.filter.class = null;
            }
        },
        countCenters : function(id){
            const that = this;
            if(this.DataCountCenter != null && this.DataCountCenter.find(o=>o.id == id) != undefined) return this.DataCountCenter.find(o=>o.id == id).value;
            else{
                if(this.DataLoadDing.Center.find(o=>o.id == id) != undefined) return '<div> đang load </div>';
                this.DataLoadDing.Center.push({id:id});
                var result = Helper.countCenters(id);
                result.then(res=>{
                    that.DataCountCenter.push({id:id,value:res.data});
                    that.DataLoadDing.Center.splice(that.DataLoadDing.Class.findIndex(o=>o.id == id),1);
                })

                return '<div>...</div>'; 
            }
        },
        countClass : function(id,type){
            const that = this;
            if(this.DataCountClass != null && this.DataCountClass.find(o=>o.id == id) != undefined) return this.DataCountClass.find(o=>o.id == id).value;
            else{
                if(this.DataLoadDing.Class.find(o=>o.id == id && o.type == type) != undefined) return '<div> đang load </div>';
                this.DataLoadDing.Class.push({id:id,type:type});
                var result = Helper.countClass(id,type);
                result.then(res=>{
                    that.DataCountClass.push({id:id,value:res.data.n});
                    that.DataLoadDing.Class.splice(that.DataLoadDing.Class.findIndex(o=>o.id == id && o.type == type),1);
                    that.ListClassData.push({id:id,type:type,l:res.data.l});
                    that.loadDataByClass(res.data.l,id,type,0);
                })
                return '<div>...</div>'
            }
        },
        loadDataByClass : function(listClass,id,type,i){
            const that = this;
            if(listClass != null && listClass.length > 0 && i < listClass.length)
            {
                that.loadBaiGiao(listClass[i],id,type)
                .then(res=>{ console.log(res);})
                .catch(err=>{console.log(err);})
                .finally(()=>{
                    if(i < listClass.length){
                        i++;
                        return that.loadDataByClass(listClass,id,type,i);
                    }
                })
                // const that = this;
                // const count = listClass.length;
                // for(let i =0; i < count; i++){
                //     var classid = listClass[i];
                //     setTimeout(()=>{
                //         that.loadBaiGiao(classid,id,type);
                //         that.loadTuLuyen(classid,id,type);
                //         that.loadLink(classid,id,type);
                //     },3000)
                // }
            }
        },
        loadBaiGiao : function(classid,id,type){
            console.log(classid,id,type);
            return Helper.GetBaiGiao(classid,id,type,this.start,this.end);
        },
        loadTuLuyen : function(classid,id,type){
            console.log(classid,id,type);
        },
        loadLink : function(classid,id,type){
            console.log(classid,id,type);
        },
        countStudents : function(id,type){
            const that = this;
            if(this.DataCountStudents != null && this.DataCountStudents.find(o=>o.id == id) != undefined) return this.DataCountStudents.find(o=>o.id == id).value;
            else{
                if(this.DataLoadDing.Student.find(o=>o.id == id && o.type == type) != undefined) return '<div> đang load </div>';
                this.DataLoadDing.Student.push({id:id,type:type});
                var result = Helper.countStudents(id,type);
                result.then(res=>{
                    that.DataCountStudents.push({id:id,value:res.data});
                    that.DataLoadDing.Student.splice(that.DataLoadDing.Student.findIndex(o=>o.id == id && o.type == type),1);
                })
                return '<div>...</div>'
            }
        },
        changeFilterDate : function(date){
            if(date && date.length > 1){
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