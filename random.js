function getRandomImage() {
  const Images = [];
  const baseUrl = 'https://raw.githubusercontent.com/Yushirizu/imissshiori/main/assets/shiori_';
  const imageFormat = '.jpg';
  const totalImages = 152;

  for (let i = 1; i <= totalImages; i++) {
    const imageNumber = i.toString().padStart(4, '0');
    const imageUrl = `${baseUrl}${imageNumber}${imageFormat}`;
    Images.push(imageUrl);
  }

  const randomIndex = Math.floor(Math.random() * Images.length);
  const randomImageUrl = Images[randomIndex];

  document.getElementById('result').innerHTML = `<img src="${randomImageUrl}">`;
}
