const searchIcon = document.querySelector(".fa-search");
const searchBar = document.querySelector("#searchBar");
const heartsFave = document.querySelectorAll(".fa-heart");
const faveCon = document.querySelector("#fave");
const closeBtn = document.querySelector(".fa-angle-down");
const faveItemCon = document.querySelector("#faveItemCon");
const timeLineDiv = document.querySelector(".time-line");
const randomeCon = document.querySelector("#random");
const searchResultCon = document.querySelector("#random .col-md-10");
const coll = document.querySelector("#coll");
const rName = document.querySelector("#name");
const rCategory = document.querySelector("#category");
const rArea = document.querySelector("#area");
const rImg = document.querySelector("#imgRandom");
const timeLineElement = document.querySelector(".time-line");
let isRandomeResult = null;
let randomValue;
const dBounc = (fn, wait) => {
  let timeOutId;
  return (...arg) => {
    if (timeOutId) {
      clearTimeout(timeOutId);
    }
    timeOutId = setTimeout(() => {
      fn.apply(null, arg);
    }, wait);
  };
};
//size of text
const sizeOfFaveItemText = (text) => {
  if (text.length > 22) return `${text}...`;
  else return text;
};
const makeEasyToFind = (text) => {
  let ind = text.indexOf(".");
  return text.substr(0, ind !== -1 ? ind : text.length);
};

function setToLocal(value) {
  localStorage.setItem("fave", JSON.stringify(value));
}

let faveList = [];

function getLocal() {
  let placement = JSON.parse(localStorage.getItem("fave"));
  if (placement) {
    faveList = placement;
  }
}
getLocal();
//staag variables
let stageRandom = true;

//fetch fn
const fetching = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};
//random meal
const random = () => {
  fetching("https://www.themealdb.com/api/json/v1/1/random.php").then(
    (data) => {
      let cameBackObj = data.meals[0];
      rArea.textContent = cameBackObj.strArea;
      rName.textContent = cameBackObj.strMeal;
      rCategory.textContent = cameBackObj.strCategory;
      rImg.src = cameBackObj.strMealThumb;
      randomValue = cameBackObj;
    }
  );
};

random();
//serarcing bar event
document.body.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-search")) {
    searchBar.classList.add("show");
    searchBar.classList.remove("hide");
    searchResultCon.children[0].classList.add("fade-out");
    searchResultCon.lastElementChild.classList.add("fade-out");
    searchResultCon.children[0].classList.remove("fade-in");
    searchResultCon.lastElementChild.classList.remove("fade-in");
  } else if (
    e.target.id !== "searchBar" &&
    searchBar.classList.contains("show")
  ) {
    searchBar.classList.remove("show");
    searchBar.classList.add("hide");
    searchResultCon.children[0].classList.remove("fade-out");
    searchResultCon.lastElementChild.classList.remove("fade-out");
    searchResultCon.children[0].classList.add("fade-in");
    searchResultCon.lastElementChild.classList.add("fade-in");
    const resultC = document.querySelector("#result");
    document.body.setAttribute("style", "");
    setTimeout(() => {
      searchBar.value = "";
    }, 1100);
  }
  if (isRandomeResult && e.target.classList.contains("fa-times")) {
    const lighBox = document.querySelector(".light-box");
    document.body.classList.replace("overflow-h", "overflow-s");
    lighBox.remove();
    isRandomeResult = false;
  }
});

//make result of the search
const searchResult = async (e) => {
  if (searchBar.value) {
    let base = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchBar.value.trim()}`;
    let obj = await fetching(base).then((data) => {
      return data.meals;
    });
    coll.classList.add("go-away");
    timeLineElement.classList.add("go-away");
    const div = `<div id="result" class="row p-3">
    <div class="col-md-12 mb-3">Search Result for <span class="red" >${searchBar.value}</span> </div>
    </div>`;
    searchResultCon.innerHTML += div;
    const getDiv = document.querySelector("#result");
    obj.forEach((e) => {
      const htmlTemple = `
      <div class="col-md-3 my-2 result-col">
            <img class="img-fluid rounded" src="${e.strMealThumb}" alt="${
        e.strMealThumb
      }">
      <div><i class="far fa-heart re-heart"></i></div>
            <p class="mt-2">${sizeOfFaveItemText(e.strMeal)}</p>
        </div>`;
      getDiv.innerHTML += htmlTemple;
    });
    addToFaveSearchResult(getDiv);
  }
};
//event on input
searchBar.addEventListener("input", dBounc(searchResult, 3000));
//after 10sec new meal
function timeLine() {
  let width = 0;
  let itId = setInterval(() => {
    timeLineDiv.style.width = `${width}%`;
    width += 0.6;
    if (width > 100) {
      clearInterval(itId);
      if (heartsFave[0].classList.contains("fas")) {
        heartsFave[0].classList.remove("fas");
        heartsFave[0].classList.add("far");
      }
      random();
      width = 0;
      timeLineDiv.style.width = `0%`;
      timeLine();
    }
  }, 100);
}
if (stageRandom) timeLine();

const makeFaveItemHtml = (name, img) => {
  const htmlTemple = `<div class="col-md-2 my-3 mx-2">
    <img
      class="img-fluid"
      src="${img}"
      alt="${name}"
    />
    <span class="remove-fave-time py-2"><i class="fa fa-times" aria-hidden="true"></i></span>
    <p>${name}</p>
  </div>`;
  faveItemCon.innerHTML += htmlTemple;
};
faveList.forEach((ele) => {
  makeFaveItemHtml(ele.name, ele.imgSrc);
});

//remove Html
const removeHtmlFave = (index) => {
  faveItemCon.children[index].remove();
};

//addToFavInRandom
const addToFavInRandom = (checkText, checkImg) => {
  let resultOfSearch = faveList.find((element) => {
    return element.name === checkText.textContent;
  });
  if (resultOfSearch) {
    let indexRemove = faveList.indexOf(resultOfSearch);
    faveList.splice(indexRemove, indexRemove + 1);
    setToLocal(faveList);
    removeHtmlFave(indexRemove);
  } else {
    let obj = {
      name: checkText.textContent,
      imgSrc: checkImg.src,
    };

    faveList.push(obj);
    makeFaveItemHtml(sizeOfFaveItemText(obj.name), obj.imgSrc);
    setToLocal(faveList);
  }
};
//adding to favorite list
heartsFave.forEach((e) => {
  e.addEventListener("click", () => {
    e.classList.toggle("far");
    e.classList.toggle("fas");
    //adding or removing on randome stage
    if (stageRandom) {
      addToFavInRandom(rName, rImg);
    }
  });
});

//add rotate to angel
closeBtn.addEventListener("click", () => {
  closeBtn.classList.toggle("rotate");
});

function lightBoxMaker(dataBack) {
  document.body.classList.remove("overflow-s");
  document.body.classList.add("overflow-h");
  scroll(0, 0);
  //make pure request
  let mainObjOne = [];
  for (let keys in dataBack) {
    if (dataBack[keys] !== null && dataBack[keys] !== "") {
      let obj = {
        [keys]: dataBack[keys]
      };
      mainObjOne.push(obj);
    }
  }
  //looping trhow for make html
  const inDivE = document.createElement("ol");
  const mesDivE = document.createElement("ul");
  let dess = "";
  for (let el of mainObjOne) {
    for (let part in el) {
      //for ingredient
      if (part.includes("Ingredient")) {
        const htmlOne = `
            <li>${el[part]}</li>`;
        inDivE.innerHTML += htmlOne;
      }
      //for mesure
      if (part.includes("Measure")) {
        const htmlTwo = `
            <li>${el[part]}</li>`;
        mesDivE.innerHTML += htmlTwo;
      }
      //desc
      if (part.includes("strInstructions")) dess = el[part];
    }
  }
  const lightHtml = `
      <div class="light-box">
      <div class="overlay">
        <div class="row">
        <div class="content my-3 col-md-6">
        <div class="closeCon">
          <p class="result-title-dec">${dataBack.strMeal}</p>
          <i class="fa fa-times"></i>
          </div>
          <div class="img col-md-3 m-auto">
            <img src="${dataBack.strMealThumb}" alt="${dataBack.strMealThumb}" class="img-fluid m-auto rounded">
          </div>
          <div class="row my-3">
                <div id="inDiv" class="col-md-6">
                  <p class="result-title-dec">Ingredients</p>
                </div>
                <div id="mesDiv" class="col-md-6">
                <p class="result-title-dec">Measure</p>
                </div>
          </div>
              <div class="row">
                <div class="col-md-12">
                <p class="result-title-dec">Instructions</p>
                      <p>${dess}</p>
                </div>
              </div>
              
              </div>
          </div>
        </div>
    </div>`;
  const fff = document.createElement("div");
  fff.innerHTML = lightHtml;
  document.body.prepend(fff);
  const ingredientsDiv = document.querySelector("#inDiv");
  ingredientsDiv.appendChild(inDivE);
  const measureDiv = document.querySelector("#mesDiv");
  measureDiv.appendChild(mesDivE);
  isRandomeResult = true;
}

coll.addEventListener("click", (e) => {
  if (e.target.id === "showRec") {
    if (faveItemCon.classList.contains("show")) {
      faveItemCon.classList.remove("show");
      setTimeout(() => {
        lightBoxMaker(randomValue);
      }, 1000);
    } else {
      lightBoxMaker(randomValue);
    }
  }
});

const lighBoxFav = (() => {
  faveItemCon.addEventListener("click", async (e) => {
    if (e.target.parentElement.className === "col-md-2 my-3 mx-2") {
      let baseUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${makeEasyToFind(
        e.target.parentElement.lastElementChild.textContent
      )}`;
      let obj = await fetching(baseUrl).then((data) => {
        return data.meals[0];
      });
      lightBoxMaker(obj);
    } else if (e.target.className === "col-md-2 my-3 mx-2") {
      let baseUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${makeEasyToFind(
        e.target.lastElementChild.textContent
      )}`;
      let obj = await fetching(baseUrl).then((data) => {
        return data.meals[0];
      });
      lightBoxMaker(obj);
    } else if (
      e.target.classList.contains("remove-fave-time") ||
      e.target.classList.contains("fa-times")
    ) {
      addToFavInRandom(
        e.target.parentElement.parentElement.lastElementChild,
        e.target.parentElement.parentElement.firstElementChild
      );
      heartsFave[0].classList.replace('fas', 'far');
    }
  });
})();

const lighBoxSearch = (() => {
  randomeCon.addEventListener("click", async (e) => {
    //for main col
    if (e.target.classList.contains("result-col")) {
      let base = `https://www.themealdb.com/api/json/v1/1/search.php?s=${makeEasyToFind(
        e.target.lastElementChild.textContent
      )}`;
      let obj = await fetching(base).then((data) => {
        return data.meals[0];
      });
      lightBoxMaker(obj);
    }
    //for img
    else if (e.target.tagName === "IMG") {
      let base = `https://www.themealdb.com/api/json/v1/1/search.php?s=${makeEasyToFind(
        e.target.parentElement.lastElementChild.textContent
      )}`;
      let obj = await fetching(base).then((data) => {
        return data.meals[0];
      });
      lightBoxMaker(obj);
    }
    //for title
    else if (e.target.tagName === "P" && e.target.classList.contains("mt-2")) {
      let base = `https://www.themealdb.com/api/json/v1/1/search.php?s=${makeEasyToFind(
        e.target.textContent
      )}`;
      let obj = await fetching(base).then((data) => {
        return data.meals[0];
      });
      lightBoxMaker(obj);
    }
  });
})();

//add to fave in search result
function addToFaveSearchResult(div) {
  for (let i of div.children) {
    i.addEventListener("click", (e) => {
      if (e.target.classList.contains("re-heart")) {
        addToFavInRandom(
          e.target.parentElement.parentElement.lastElementChild,
          e.target.parentElement.parentElement.firstElementChild
        );
        e.target.classList.toggle("far");
        e.target.classList.toggle("fas");
        e.target.classList.toggle("red");
      }
    });
  }
}