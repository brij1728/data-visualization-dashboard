import App from './app';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 3000;


App.get('/', (req, res) => {
   res.send(`Server is running at port ${PORT}`);
});

mongoose.connect(process.env.DB_URL, {
   
}).then(() => {
   console.log(`Listening on port ${PORT}`);
   console.log('Connected to the database');
}).catch((error) => {
   console.log('Error in connecting to the database', error);
});


App.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});