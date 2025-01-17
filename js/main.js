document.addEventListener('DOMContentLoaded', ()=>{
  initApp();
});

async function initApp(){
  /**Get the characters and insert in DOM */
  const API = 'https://rickandmortyapi.com/api/character'; 
  const characters = await getData(API);
  const containerCards = document.querySelector('.container-cards');
  insertCards(characters, containerCards);
  
  /**Searcher  */
  const searcher = document.querySelector('#searcher');
  searcher.addEventListener('input',(event)=>{
    const charactersFilter = characters.filter((character)=>character.name.toLowerCase().includes(event.target.value.toLowerCase()));    
    containerCards.replaceChildren()
    insertCards(charactersFilter, containerCards)
  });

  /**Show more characters */
  let page = 2;
  let API_EXTENSION = `https://rickandmortyapi.com/api/character?page=${page}`;
  let moreCharacters;
  const buttonShowMore = document.querySelector('.button-show-more');
  buttonShowMore.addEventListener('click',async ()=>{
    moreCharacters = await getData(API_EXTENSION);
    insertCards(moreCharacters,containerCards);
    characters.push(...moreCharacters);
    page++;
    API_EXTENSION = `https://rickandmortyapi.com/api/character?page=${page}`;
    if(searcher.value){
      const charactersFilter = characters.filter((character)=>character.name.toLowerCase().includes(searcher.value.toLowerCase()));
      containerCards.replaceChildren()
      insertCards(charactersFilter, containerCards)
    }
    if(page > 34){
      buttonShowMore.remove();
    }
  });

}
function getData(API){
  const charactersData = fetch(API)
                          .then(result => result.json())
                          .then(data => data.results)
                          .then(charactersData=>{
                            return charactersData.map((character)=>{
                              return {
                                id: character.id,
                                name: character.name,
                                status: character.status,
                                species: character.species,
                                gender: character.gender,
                                image: character.image,
                              }
                            });
                          })
                          .catch((error)=>console.log(error));
  return charactersData;
}
function insertCards(characters = [], container){
  //characters = toSpanish(characters);
  for (let index in characters) {
    /**Create HTML elements */
    const card = document.createElement('DIV');
    card.classList.add('card')
    const imageCard = document.createElement('IMG');
    const textContainer = document.createElement('DIV');
    textContainer.classList.add('card__text-container')
    const textName = document.createElement('P');
    const textStatus = document.createElement('P');
    textStatus.classList.add('center')
    const textGender = document.createElement('P');
    /**Add attributes and text to the HTML elements */
    imageCard.src = characters[index].image;
    imageCard.alt = `Tarjeta de un personaje de Rick and Morty llamado ${characters[index].name}`
    textName.innerHTML = `<span class="attributes">Nombre: </span>${characters[index].name}`;
    textStatus.innerHTML = `<span class="${classifyStatus(characters[index].status)}"</span>${characters[index].status.toUpperCase()}</span> - 
                            <span class="${classifySpecie(characters[index].species)}"</span>${characters[index].species.toUpperCase()}</span>`;    
    textGender.innerHTML = `<span class="attributes">Género: </span>${characters[index].gender}`;

    /**Add the elements to the container */
    card.appendChild(imageCard);
    textContainer.appendChild(textStatus);
    textContainer.appendChild(textName);
    textContainer.appendChild(textGender);
    card.appendChild(textContainer);
    container.appendChild(card);
  }
}
function classifyStatus(status){
  if(status === 'Alive'){
    return 'Alive';
  }else if (status === 'Dead'){
    return'Dead';
  } else {
    return 'Unknown';
  }
}
function classifySpecie(specie = ""){
  if (specie === 'Human'){
    return 'Human';
  } else if(specie === 'Alien'){
    return 'Alien';
  } else if(specie === 'unknown') {
    return 'Unknown';
  } else {
    return 'Another';
  }


}
function toSpanish(characters = []) {
  characters = characters.map(character=>{
    if(character.status.toLowerCase() === 'alive'){
      character.status = 'Vivo/a';
    }else if(character.status.toLowerCase() === 'dead'){
      character.status = 'Muerto/a';
    } else if(character.status.toLowerCase() === 'unknown'){
      character.status = 'Desconocido'
    }
    if(character.gender.toLowerCase() === 'male'){
      character.gender = "Masculino";
    } else if(character.gender.toLowerCase() === 'female'){
      character.gender = "Femenino";
    }else if(character.gender.toLowerCase() === 'unknown'){
      character.gender = 'Desconocido';
    }
    return character;
  });
  return characters;
}