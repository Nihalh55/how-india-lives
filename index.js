const express = require('express');
const path = require('path');
const mysql = require('mysql');
const PORT = process.env.PORT || 5000;
const fs = require('fs');
const bodyParser = require('body-parser');

var pool = mysql.createPool({
    host     : 'us-cdbr-iron-east-01.cleardb.net',
    user     : 'b0f693560edb2c',
    password : '4e033ea0',
    database : 'heroku_7d8b3caef3dcfea'
});

var app = express()

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req,res) => res.render('pages/search'))
app.get('/statistics', (req, res) => res.render('pages/statistics'))
app.get('/circle', (req, res) => res.render('partial/lol'))

app.get('/dump', function(req,res){
    pool.query('select d.name dname, s.name sname, d.district did, State sid from pca_total d, State s where d.State = s.SID', function(err, results, fields){
        if(err) throw err;
        data = JSON.stringify(results, null, 2);
        res.send(results);
        fs.writeFile('public/data/district-list.json', data, (err) => {  
            if (err) throw err;
            console.log('Data written to file');
        });
    });
});


//to query results for statistics
app.post('/database', function(req,res){

    if(String(Number(req.body.input)) == req.body.input) {
        pool.query('SELECT * FROM pca_total WHERE district='+req.body.input, function(err, results, fields) {
            if(err) throw err;
            res.send(results);
        });
    }
    else if(req.body.input == "Mumbaipop"){
        var query = "SELECT Name '', TOT_P Total, TOT_M Males, TOT_F Females FROM pca_total where Name='Mumbai'";
        pool.query(query,function(err,results,fields){
            if(err) throw err;
            console.log(results);
            console.log('Mumbai Population data sent');
            res.send(results);
        });
    }
    else if(req.body.input == "Population"){
        var query = "SELECT name Name, TOT_P, TOT_M, TOT_F FROM pca_total ORDER BY TOT_P " + req.body.table + " LIMIT 5;"
        pool.query(query,function(err,results,fields){
            if(err) throw err;
            res.send(results);
            console.log('Population data sent');
        });
    }
    else if(req.body.input == "Literacy Rate"){ 
        var query = "SELECT name Name, (P_LIT / TOT_P)*100 Literacy_Rate, (M_LIT / TOT_P)*100 Literacy_Rate_M, (F_LIT / TOT_P)*100 Literacy_Rate_F FROM pca_total ORDER BY Literacy_Rate " + req.body.table + " LIMIT 5;"
        pool.query(query,function(err,results,fields){
    
            if(err) throw err;
            res.send(results);
            console.log('Literacy rate data sent');
        });
    }
    else if(req.body.input == "Unemployement Rate"){
        var query = "SELECT name Name, (NON_WORK_P / TOT_P)*100 Unemployement_Rate, (NON_WORK_M / TOT_P)*100 Unemployement_Rate_M, (NON_WORK_F / TOT_P)*100 Unemployement_Rate_F FROM pca_total ORDER BY Unemployement_Rate " + req.body.table + " LIMIT 5;"
        pool.query(query,function(err,results,fields){
            if(err) throw err;
            res.send(results);
            console.log('Unemployment data sent');
        });
    }
    else if(req.body.input == "Percent of Agricultural Labourers"){
        var query = "SELECT name Name, (MAIN_AL_P / TOT_P)*100 Agricultural_Labourers FROM pca_total ORDER BY Agricultural_Labourers " + req.body.table + " LIMIT 5;"
        pool.query(query,function(err,results,fields){
            if(err) throw err;
            res.send(results);
            console.log('Data sent');
        });
    }
    else if(req.body.input == "Percent of Scheduled Caste People"){
        var query = "SELECT name Name, (P_SC / TOT_P)*100 Scheduled_Caste_People FROM pca_total ORDER BY Scheduled_Caste_People " + req.body.table + " LIMIT 5;"
        pool.query(query,function(err,results,fields){
            if(err) throw err;
            res.send(results);
            console.log('Data sent');
        });
    }
    else if(req.body.input == "Percent of Scheduled Tribe People"){
        var query = "SELECT name Name, (P_ST / TOT_P)*100 Scheduled_Tribe_People FROM pca_total ORDER BY Scheduled_Tribe_People " + req.body.table + " LIMIT 5;"
        pool.query(query,function(err,results,fields){
            if(err) throw err;
            res.send(results);
            console.log('Data sent');
        });
    }
    else if(req.body.input == "Percent of Children (0-6 Age Group)"){
        var query = "SELECT name Name, (P_06 / TOT_P)*100 Children FROM pca_total ORDER BY Children " + req.body.table + " LIMIT 5;"
        pool.query(query,function(err,results,fields){
            if(err) throw err;
            res.send(results);
            console.log('Data sent');
        });
    }
    else if(req.body.input == "Total Households"){
        var query = "SELECT p.name Name, h.Total_Number_of_Dilapidated, h.DW_TFUS Unsafe_Water, h.Waste_water_ND No_drainage FROM hlpca_total as h, pca_total as p WHERE p.District = h.District_Code ORDER BY  h.Total_Number_of_Dilapidated " + req.body.table + " LIMIT 5;"
        pool.query(query,function(err,results,fields){
            if(err) throw err;
            res.send(results);
            console.log('Household data sent');
        });
    }
    else if(req.body.table == "pca"){

        if(req.body.input == "TOT_P" || req.body.input == "Households"){

            //the req.body.input has the attribute name for the table
            req.body.input = "TOT_P";
            var query = "select distinct state.ISO_Code as State_Code, state.Name as State, t.value as " + req.body.input + " from (select state, sum(" + req.body.input +") value from pca_total group by state) as t,state where t.state = state.sid;"
            pool.query(query,function(err,results,fields){
                if(err) throw err;
                res.send(results);
                console.log('Data sent');
            });
        }
        /*else if(req.body.input == "Households"){

            //the req.body.input has the attribute name for the table
            var query = "select distinct state.ISO_Code as State_Codee, state.Name as State, (t.value/t.total)*100 as " + req.body.input + " from (select pca_total.state as state_code, sum(" + req.body.input +" * Total_Number_of_households) value,sum(Total_Number_of_households) total from hlpca_total, pca_total  group by pca_total.state state Inner join pca_total on hlpca_total where hlpca_total.district_code = pca_total.district) as t,state where t.state_code = state.sid;"
            pool.query(query,function(err,results,fields){
                if(err) throw err;
                res.send(results);
                console.log('Data sent');
            });
        }*/
        else{

            //the req.body.input has the attribute name for the table
            var query = "select distinct state.ISO_Code as State_Code, state.Name as State, (t.value/t.total)*100 as " + req.body.input + " from (select state, sum(" + req.body.input +") value,sum(TOT_P) total from pca_total group by state) as t,state where t.state = state.sid;"
            pool.query(query,function(err,results,fields){
                if(err) throw err;
                res.send(results);
                console.log('Data sent');
            });
        }
    }
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

/*
app.get('/data', function(req, res){
    data = require('./public/data/district-list.json')
    res.send(data)
});
*/
/*
app.get('/state', function(req, res){
    pool.query('SELECT * FROM State', function(err, results, fields){
        if(err) throw err;
        res.render('pages/state', {result: results});
    });
});
*/
