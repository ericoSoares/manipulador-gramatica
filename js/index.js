//Objeto onde será armazenada a gramatica
let gramat = {};
//Lista de sentenças geradas
let sentGeradas = [];

//Inicia a execução, chamando todas as outras funções necessarias
$("#submit").click(function() {
  gramat = {};
  sentGeradas = [];
  $("#results").html("<p><strong>Resultados:</strong></p>");
  gramat.NT = $('#nTerm').val().split(",") || [];
  gramat.T = $('#term').val().split(",") || [];
  gramat.P = $('#prods').val().split("\n") || [];
  gramat.S = $('#simbIni').val() || [];
  tratamento();
  tratamentoP();
  console.log(gramat);
  if (validacao()) {
    if (isGR()) {
      $('#results').append("<p>É uma  <strong>Gramática Regular</strong></p>");
    } else {
      if (isGLC()) {
        $('#results').append("<p>É uma <strong>Gramática Livre de Contexto</strong></p>");
      } else {
        printErro("Gramática não reconhecida!");
      }
    }
    $('#results').append(formataGram());
    while(sentGeradas.length < 3) {
      let aux = geraSent();
      console.log(aux);
      sentGeradas.push(aux);
    }
    printSentGeradas();
  }
});

//Interpreta os inputs correspondentes a NT, T e S
function tratamento() {
  for(let i = 0; i < gramat.NT.length; i++) {
    gramat.NT[i] = gramat.NT[i].trim();
  }
  for(let i = 0; i < gramat.T.length; i++) {
    gramat.T[i] = gramat.T[i].trim();
  }
  for(let i = 0; i < gramat.P.length; i++) {
    gramat.P[i] = gramat.P[i].trim();
  }
  gramat.S = gramat.S.trim();
}

//Interpreta o input correspondente as produções
function tratamentoP() {
  for(let i = 0; i < gramat.P.length; i++) {
    let aux1 = [];
    aux1 = gramat.P[i].split("->");
    aux1[0] = aux1[0].trim();
    aux1[1] = aux1[1].trim();
    aux1[1] = aux1[1].split("|");
    for(let j = 0; j < aux1[1].length; j++) {
      aux1[1][j] = aux1[1][j].trim(); 
    }
    aux1[1] = aux1[1].filter((elem) => {
      return elem != "";
    });
    gramat.P[i] = aux1;
  }
}

//Verifica se gramatica é GR
function isGR() {
  if(gramat.P[0][0].length != 1) {
    printErro("Lado esquerdo tem mais de 1 letra");
    return false;
  }
  for(let i = 0; i < gramat.P.length; i++) {
    if(gramat.P[i][0] != gramat.P[i][0].toUpperCase()) {
      printErro("Lado esquerdo possui terminais");
      return false;
    }
  }
  for(let i = 0; i < gramat.P.length; i++) {
    for(let j = 0; j < gramat.P[i][1].length; j++) {
      if(gramat.P[i][1][j].length == 1) {
        if(gramat.P[i][1][j] != gramat.P[i][1][j].toLowerCase()) {
          printErro("Lado direito: NT sozinho");
          return false;
        }
      } else {
        if(gramat.P[i][1][j].length == 2) {
          if(!(gramat.P[i][1][j].charAt(0) == gramat.P[i][1][j].charAt(0).toLowerCase() &&
            gramat.P[i][1][j].charAt(1) == gramat.P[i][1][j].charAt(1).toUpperCase())) {
            printErro("Lado direito: NT não seguido de T");
            return false;
          }
        } else {
          printErro("Lado direito possui mais de 2 simbolos");
          return false;
        }
      }
    }
  }
  return true;
}

//Verifica se gramatica é GLC
function isGLC() {
  if(gramat.P[0][0].length != 1) {
    printErro("Lado esquerdo tem mais de 1 letra");
    return false;
  }
  for(let i = 0; i < gramat.P.length; i++) {
    if(gramat.P[i][0] != gramat.P[i][0].toUpperCase()) {
      printErro("Lado esquerdo possui terminais");
      return false;
    }
  }
  for(let i = 0; i < gramat.P.length; i++) {
    for(let j = 0; j < gramat.P[i][1].length; j++) {
      if(gramat.P[i][1][j].includes("&")) {
        printErro("Lado direito possui sentença vazia (&)");
        return false;
      }
    }
  }
  return true;
}

//Formata gramatica
function formataGram() {
  let str = "G = ({";
  str += gramat.NT + "}, {";
  str += gramat.T + "}, P, ";
  str += gramat.S + ")<br>";
  str += "P = <br>";
  let aux = $('textarea').val().split("\n");
  for(let i = 0; i < aux.length; i++) {
    str += aux[i] + "<br>";
  }
  return str;
}

//valida gramatica
function validacao() {
  for(let i = 0; i < gramat.P.length; i++) {
    if(!(gramat.NT.includes(gramat.P[i][0]))) {
      printErro("ERRO: P possui NTs não declarados!");
      return false;
    }
  }
  let aux = false;
  for(let i = 0; i < gramat.P.length; i++) {
    if(gramat.P[i][0].includes(gramat.S)) {
      aux = true;
    }
  }
  if(!aux) {
    printErro("ERRO: Simbolo inicial não reconhecido!");
    return false;
  }
  for(let i = 0; i < gramat.P.length; i++) {
    for(let j = 0; j < gramat.P[i][1].length; j++) {
      for(let k = 0; k < gramat.P[i][1][j].length; k++) {
        if(!gramat.T.includes(gramat.P[i][1][j].charAt(k)) && !isUpper(gramat.P[i][1][j].charAt(k))) {
          printErro("ERRO: P possui Ts não declarados!");
          return false;
        }
      }
    }
  }
  return true;
}

//Verifica se char é maiusculo
function isUpper(char) {
  return char == char.toUpperCase();
}

//Printa erro na tela, escondendo os anteriores
function printErro(string) {
  $('#erros').html("");
  $('#erros').append("<p>" + string + "</p>");
  
}

//Troca char em determinada posição na string pela string enviada
function replaceInd(str, ind, rep) {
	if(ind > str.length-1) return str;
  return str.substr(0,ind) + rep + str.substr(ind+1);
}

//Verifica se uma letra maiuscula (T) é um NT da gramatica
function incluiP(T) {
  for(let i = 0; i < gramat.P.length; i++) {
    if(gramat.P[i][0] == T) {
      return gramat.P[i][1];
    }
  }
  return "";
}

//Gera uma sentença aleatoria conforma a gramatica
function geraSent() {
  let res = "";
  let cont = 0;
  let S = [];
  for(let i = 0; i < gramat.P.length; i++) {
    if(gramat.P[i][0] == gramat.S) {
      S = gramat.P[i][1];
    }
  }
  
  let nRand = Math.floor(Math.random() * (S.length-1 - 0 + 1)) + 0;
  res += S[nRand];
  while(res != res.toLowerCase() && cont < 1000) {
    console.log("Entrou no while");
    for(let i = 0; i < res.length; i++) {
      if(res.charAt(i) != res.charAt(i).toLowerCase()) {
        let aux = incluiP(res.charAt(i));
        if(aux != "") {
          nRand = Math.floor(Math.random() * (aux.length-1 - 0 + 1)) + 0;
          res = replaceInd(res, i, aux[nRand]);
        }
      }
    }
    cont++;
  }
  return res;
}

//Printa na tela as sentenças geradas
function printSentGeradas() {
  for(let i = 0; i < sentGeradas.length; i++) {
    if(sentGeradas[i] != sentGeradas[i].toLowerCase()) {
      sentGeradas[i] = sentGeradas[i].replace(/[A-Z]/g, "");
    }
  }
  $('#results').append("<p><strong>Sentenças Geradas:</strong></p>");
  for(let i = 0; i < sentGeradas.length; i++) {
    $("#results").append(i + " - " + sentGeradas[i] + "<br>");
  }
}