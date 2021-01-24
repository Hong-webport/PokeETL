console.log('Connected to Pokedex')

document.addEventListener("DOMContentLoaded", () =>{

    let generateBtn = document.querySelector('#generate-pokemon1');
    generateBtn.addEventListener('click', render1)
})

function render1(){
    let allPokemonContainer = document.querySelector('#poke-container')
    allPokemonContainer.innerText = "";
    fetchGen1Pokemon1();
}

function fetchGen1Pokemon1(){
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
    .then(response => response.json())
    .then(function(allpokemon){
        allpokemon.results.forEach(function(pokemon){
            fetchPokemonData(pokemon);
            allpokemon.results.sort(sortpoke);
        })
    })
}

function sortpoke(a,b){ 
    return a.url - b.url;
}

function fetchPokemonData(pokemon){
    let url = pokemon.url
    fetch(url)
    .then(response => response.json())
    .then(function(pokeData){
        renderPokemon(pokeData)
    })
}

function renderPokemon(pokeData){
    let allPokemonContainer = document.getElementById('poke-container');
    let pokeContainer = document.createElement("div")
    pokeContainer.classList.add('ui', 'card');

    createPokeImage(pokeData.id, pokeContainer);

    let pokeName = document.createElement('h4') 
    pokeName.innerText = pokeData.name

    let pokeNumber = document.createElement('p')
    pokeNumber.innerText = `#${pokeData.id}`
   
    let pokeTypes = document.createElement('ul')
  
    createTypes(pokeData.types, pokeTypes)

    pokeContainer.append(pokeName, pokeNumber, pokeTypes);
    allPokemonContainer.appendChild(pokeContainer);
}

function createTypes(types, ul){
    types.forEach(function(type){
        let typeLi = document.createElement('li');
        typeLi.innerText = type['type']['name'];
        ul.append(typeLi)
    })
}

function createPokeImage(pokeID, containerDiv){
    let pokeImgContainer = document.createElement('div')
    pokeImgContainer.classList.add('image')
    console.log('Image Added')
    let pokeImage = document.createElement('img')
    pokeImage.srcset = `https://github.com/GitJudd/teamtriangle/blob/main/pokedex/${pokeID}.png?raw=true`
    
    pokeImgContainer.append(pokeImage);
    containerDiv.append(pokeImgContainer);
}

