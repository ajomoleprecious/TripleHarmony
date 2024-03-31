import express from 'express';

const app = express();

app.set('view engine', 'ejs');
app.set('port', 3000);

app.use(express.static('public'));

app.get('/',(req,res)=>{
  res.render('index');
});

app.listen(app.get('port'), async () => {
  console.log( '[server] http://localhost:' + app.get('port'));
});