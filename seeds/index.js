const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
  console.log("DB Connected");
}
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const Cprice = Math.floor(Math.random() * 20) + 10;//
    await new Campground({
      author: '67a77c18e39d16ff4488aaa2',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`.replace(["fallon","\u0000-\u001F\u007F-\u009F"], "wall"),

      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dicta cumque harum odio repudiandae, cupiditate praesentium odit repellendus fugit velit dolorem, accusantium debitis. Accusamus quidem consequuntur culpa autem quas illo saepe.',
      price: Cprice,
      images: [
        {
          url: 'https://res.cloudinary.com/dymakiqo3/image/upload/v1740746994/YelpCamp/uuaaezw67srnk9eb74a0.jpg',
          filename: 'YelpCamp/uuaaezw67srnk9eb74a0',
        },
        {
          url: 'https://res.cloudinary.com/dymakiqo3/image/upload/v1740746996/YelpCamp/ewtyhufnkbfhjadvt1bu.jpg',
          filename: 'YelpCamp/ewtyhufnkbfhjadvt1bu',
        }
      ],
      geometry:
        { "type": "Point", "coordinates": [cities[random1000].longitude, cities[random1000].latitude] }
    }).save();
  }
}
seedDB().then(() => {
  mongoose.connection.close();
})