const fs = require('fs');

var query = `
query ($page: Int, $perPage: Int) {
  Page (page: $page, perPage: $perPage) {
    pageInfo{
        hasNextPage
        currentPage
    }
    characters {
        name {
          full
          native
        }
        gender
        image {
          large
          medium
        }
        favourites
        media{
          nodes{
            title {
              romaji
              english
            }
          }
        }
      }
  }
}
`;

let page = 1;
let i = 1;
let newObject = {};

function subirDatos(page) {
    var variables = {
        page: page,
        perPage: 50
    };

    var url = 'https://graphql.anilist.co',
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        };

    setTimeout(() => {
        fetch(url, options).then(handleResponse)
            .then(handleData)
            .catch(handleError);
    }, 670);

}

subirDatos(page);

function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}

function handleData(data) {
    let dataArray = data.data.Page.characters;
    dataArray.forEach(e => {
        e.id = i;
        e.anime = e.media.nodes[0];
        e.media = "";
        newObject[i] = e;
        i++;
    });

    const jsonData = JSON.stringify(newObject, null, 2);
    fs.writeFile('datos.json', jsonData, 'utf8', err => {
        if (err) {
            console.error('Error al escribir en el archivo JSON:', err);
        } else {
            console.log(`Datos guardados. Página ${data.data.Page.pageInfo.currentPage}.`);
            if (data.data.Page.pageInfo.hasNextPage) {
                subirDatos(data.data.Page.pageInfo.currentPage + 1);
            }
        }
    });
}

function handleError(error) {
    console.log('Error, check console');
    console.error(error);
}