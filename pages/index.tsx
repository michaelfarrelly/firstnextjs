import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React from "react";
import styles from "../styles/Home.module.css";
import Keyboard from "../components/keyboard";
import WordGuess from "../components/wordguess";

import ActiveGuess from "../components/activeguess";
import {
    uniqueLetters,
    getOkLetters,
    getOutOfPlaceLetters,
} from "../components/util";

const Home: NextPage = () => {
    const [isLoading, setLoading] = React.useState(false);
    const [guessedWords, setGuessedWords] = React.useState<string[]>([]);
    const [outOfPositionLetters, setOut] = React.useState<string[]>([]);
    const [okLetters, setOk] = React.useState<string[]>([]);
    const [finalWord, setFinalWord] = React.useState<string>("STOLE");

    const [letters, setLetters] = React.useState<string[]>(
        uniqueLetters(guessedWords)
    );

    React.useEffect(() => {
        setLetters(uniqueLetters(guessedWords));
        setOk(getOkLetters(guessedWords, finalWord));
        setOut(getOutOfPlaceLetters(guessedWords, finalWord));
    }, [guessedWords, finalWord, setLetters, setOk, setOut]);

    const onAccept = React.useCallback(
        (nextGuess: string) => {
            setGuessedWords((last) => [...last, nextGuess]);
        },
        [setGuessedWords]
    );

    React.useEffect(() => {
        setLoading(true);
        setGuessedWords([]);
        setOut([]);
        setOk([]);
        setFinalWord("1");
        setLetters([]);

        fetch("api/today")
            .then((res) => res.json())
            .then((data) => {
                setFinalWord(data.word.toUpperCase());
                setLoading(false);
            });
    }, []);

    return (
        <div className={styles.container}>
            <Head>
                <title>Woorlde</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Woorlde</h1>
                <p className={styles.description}>How to play the game.</p>
                {isLoading && <p>Loading...</p>}
                {!isLoading && (
                    <>
                        <div className={styles.grid}>
                            <div>Guesses</div>
                            {guessedWords.map((word, wordindex) => (
                                <WordGuess
                                    key={`gword_${wordindex}`}
                                    word={word}
                                    finalWord={finalWord}
                                />
                            ))}
                            <ActiveGuess
                                finalWord={finalWord}
                                onAccept={onAccept}
                            />
                        </div>
                        <div className={styles.keyboard}>
                            <Keyboard
                                letters={letters}
                                okLetters={okLetters}
                                outOfPositionLetters={outOfPositionLetters}
                            ></Keyboard>
                        </div>
                    </>
                )}
            </main>

            <footer className={styles.footer}>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{" "}
                    <span className={styles.logo}>
                        <Image
                            src="/vercel.svg"
                            alt="Vercel Logo"
                            width={72}
                            height={16}
                        />
                    </span>
                </a>
            </footer>
        </div>
    );
};

export default Home;
