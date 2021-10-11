import { Switch } from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import { useState } from "react";
import wordsArray from "../files/wordsArray";

export default function Home() {
  let [state, setState] = useState({
    searchWord: "",
    useWordLength: true,
    wordLength: 0,
    randomWords: [],
    numberOfRandomWords: 0,
    actualWords: [],
    audio: null,
    song: "",
  });

  let generateRandomWords = async (numberOfWords) => {
    let wordsWithMarchingLength = [];
    if (state.useWordLength && state.wordLength != "0") {
      for (let i = 0; i < wordsArray.length; i++) {
        if (wordsArray[i].length == state.wordLength) {
          wordsWithMarchingLength.push(wordsArray[i]);
        }
      }
    } else {
      wordsWithMarchingLength = wordsArray;
    }

    let fetched = [];
    while (fetched.length < Number(numberOfWords)) {
      let randomNum = Math.round(
        Math.random() * wordsWithMarchingLength.length
      );
      let word = wordsWithMarchingLength[randomNum];
      if (!fetched.includes(word)) {
        fetched.push(word);
      }
    }

    setState({
      ...state,
      actualWords: fetched,
    });
  };

  let searchWordsEndingWith = (phrase, length) => {
    if (phrase.trim() != "") {
      let words = [];
      for (let i = 0; i < wordsArray.length; i++) {
        if (
          wordsArray[i].substring(
            wordsArray[i].length - phrase.length,
            wordsArray[i].length
          ) == phrase
        ) {
          words.push(wordsArray[i]);
        }
      }
      setState({ ...state, actualWords: words });
    }
  };

  let handleInput = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  let loadAudio = (e) => {
    setState({ ...state, audio: e.target.value });
    let fetched = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(fetched);
    reader.onload = () => {
      setState({ ...state, audio: reader.result });
    };
  };

  let appendToSong = (word) => {
    setState({ ...state, song: `${state.song} ${word}` });
  };

  return (
    <main>
      <footer>
        <div className="toolBox">
          <div className="eachToolBox">
            <p>Select Audio</p>
            <input onChange={loadAudio} type="file" />
          </div>
          <div className="eachToolBox">
            <p>Word Length</p>
            <div>
              <label>Use Length</label>
              <Switch />
            </div>
            <div>
              <KeyboardArrowUp
                onClick={() => {
                  setState({ ...state, wordLength: state.wordLength + 1 });
                }}
              />
              <span>{state.wordLength}</span>

              <KeyboardArrowDown
                onClick={() => {
                  setState({
                    ...state,
                    wordLength:
                      state.wordLength > 0
                        ? state.wordLength--
                        : state.wordLength,
                  });
                }}
              />
            </div>
          </div>
          <div className="eachToolBox">
            <p>Get Random Words</p>
            <input
              placeholder="number of words"
              value={state.numberOfRandomWords}
              type="number"
              name="numberOfRandomWords"
              onChange={handleInput}
              className="numberInput"
            />
            <div>
              <button
                onClick={() => generateRandomWords(state.numberOfRandomWords)}
              >
                Get {state.numberOfRandomWords} Random words
              </button>
            </div>
          </div>
          <div className="eachToolBox">
            <p>Get Words Ending With</p>
            <input
              placeholder="words ending with"
              value={state.searchWord}
              name="searchWord"
              onChange={handleInput}
            />
            <button onClick={() => searchWordsEndingWith(state.searchWord)}>
              Refresh
            </button>
          </div>
          <div className="eachToolBox">
            <audio controls src={state.audio}></audio>
          </div>
        </div>
      </footer>
      <div className="screen">
        {state.actualWords.map((each, index) => {
          return (
            <p
              key={index}
              onClick={() => {
                appendToSong(each);
              }}
            >
              {each}
            </p>
          );
        })}
      </div>{" "}
      <section className="workArea">
        <textarea name="song" value={state.song} onChange={handleInput} />
      </section>
    </main>
  );
}
