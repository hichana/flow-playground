import React from "react";
import { Text } from "theme-ui";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { WhiteOverlay } from "components/Common";

import Mixpanel from "util/mixpanel";
import ActionButton from 'components/ActionButton';

const examples = [
  {
    title: " First Steps",
    subtitle:
      "Learn how to use smart contracts, switch accounts, and view account state.",
    emoji: "🏃",
    docsLink: "https://docs.onflow.org/cadence/tutorial/01-first-steps/"
  },
  {
    title: "Hello, World!",
    subtitle:
      "Write your first contract on Flow. This is the perfect place to start to get the hang of the fundamentals of Cadence.",
    emoji: "🌎",
    projectLink: "https://play.onflow.org/f51905e8-6030-4641-9324-11a3f1a6091c",
    docsLink: "https://docs.onflow.org/cadence/tutorial/02-hello-world/"
  },
  {
    title: "Mint Fungible Tokens",
    subtitle:
      "Create and sell digital assets of your own in this tutorial! This tutorial will teach you the basics of creating, storing, and moving digital assets and tokens.",
    emoji: "💸",
    projectLink: "https://play.onflow.org/50745fb6-77d5-4510-adfc-cf448fb043e1",
    docsLink: "https://docs.onflow.org/cadence/tutorial/03-fungible-tokens/"
  },
  {
    title: "Create Non-Fungible Tokens",
    subtitle:
      "Create and shape your own unique digital objects. Here you’ll learn what really makes blockchains magic - the ability for unique items to be created, shared, and stored forever.",
    emoji: "😺",
    projectLink: "https://play.onflow.org/524612f1-9921-4836-9b64-e7a7c8de81d6",
    docsLink: "https://docs.onflow.org/cadence/tutorial/04-non-fungible-tokens/"
  },
  {
    title: "Build a Marketplace",
    subtitle:
      "Put it all together in a marketplace! This tutorial will teach you how to turn all the concepts you’ve learned into a place for people to share their creations with the community.",
    emoji: "🤝",
    projectLink: "https://play.onflow.org/af759188-6c0d-468a-9eda-50844f522261",
    docsLink: "https://docs.onflow.org/cadence/tutorial/05-marketplace-setup/"
  },
  {
    title: "Expand Non-Fungible Tokens",
    subtitle:
      "This tutorial is for the brave and the bold, an opportunity to discover what resources make possible - resources owning other resources. If you can imagine it, you can create it.",
    emoji: "🤠",
    projectLink: "https://play.onflow.org/dd33e2ba-098e-4033-a575-d56b8a3bf7b0",
    docsLink: "https://docs.onflow.org/cadence/tutorial/07-resources-compose/"
  },
  {
    title: "Voting Contract",
    subtitle:
      "With the advent of blockchain technology and smart contracts, it has become popular to try to create decentralized voting mechanisms that allow large groups of users to vote completely on chain",
    emoji: "🗳️",
    projectLink: "https://play.onflow.org/5f9fabb2-b865-4b6e-8e1b-cad2ef43ae0f",
    docsLink: "https://docs.onflow.org/cadence/tutorial/08-voting/"
  }
];

const ExamplesContainer = styled(motion.div)`
  position: fixed;
  display: flex;
  flex-direction: row;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  bottom: 0;
  justify-content: center;
  align-items: center;

  a {
    text-decoration: none;
    color: inherit;
    -moz-appearance: none;
    -webkit-appearance: none;
  }
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  
  & h3 {
    font-size: 1.5rem;
  }

  & svg {
    cursor: pointer;
  }
`;

const ExampleContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(100px, 320px));
  grid-gap: 1rem;
  a, .full-height{
    height: 100%;
  }
  
`;

const Buttons = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
  width: 100%;
  
  align-items: flex-start;
  
  button{
    width: 100%;
  }
`


const Example = styled.div`
  display: grid;
  grid-template-rows: 80px auto 1fr auto;
  grid-gap: 1rem;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.07);
  transition: all 0.25s ease-in-out;
  background: white;
  box-sizing: border-box;

  &:hover {
    //border: 2px solid rgba(0, 255, 55, 0.32);
    box-shadow: 0 0 15px 0 rgba(189, 196, 244, 0.6);
  }

  .title {
    font-size: 22px;
    color: #333;
    font-weight: 700;
    text-align: center;
    justify-content: center;
    height: 100%;
  }

  .subtitle {
    line-height: 22px;
    font-size: 15px;
    text-align: left;
    align-items: flex-start;
    height: 100%;
    padding-bottom: 0.5rem;
  }

  .emoji {
    font-size: 3rem;
    align-items: center;
    justify-content: center;
    height: 100%;
    display: flex;
  }
`;

const Examples: React.FC<{
  visible: boolean;
  triggerClose?: (e: React.SyntheticEvent) => any;
}> = ({ visible, triggerClose }) => {
  const ExampleContainers = {
    visible: {
      display: "flex",
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      },
      zIndex: 99
    },
    hidden: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.1,
        staggerDirection: -1
      },
      zIndex: -1
    }
  };

  const exampleItem = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        ease: [1, 0.5, 0, 0]
      }
    },
    hidden: {
      opacity: 0,
      x: 200,
      transition: {
        ease: [1, 0.5, 0, 0]
      }
    }
  };

  return (
    <ExamplesContainer
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      variants={ExampleContainers}
    >
      <WhiteOverlay onClick={triggerClose} />
      <Stack>
        <Header>
          <h3>Playground Tutorials</h3>
          <IoMdClose size={34} onClick={triggerClose} />
        </Header>
        <ExampleContainer>
          {examples.map((_example: any, index: number) => {
            return (
                <motion.div variants={exampleItem} key={index} className={"full-height"}>
                  <Example>
                    <Text className="emoji">{_example.emoji}</Text>
                    <Text className="title">{_example.title}</Text>
                    <Text className="subtitle">{_example.subtitle}</Text>
                    <Buttons>
                      <a
                        title={`Go to documentation for "${_example.title}"`}
                        href={_example.docsLink}
                        target="_blank"
                        rel="noopener"
                        onClick={() => {
                          Mixpanel.track("Redirect to project documentation", {
                            link: _example.docsLink,
                            title: _example.title
                          });
                        }}
                      >
                        <ActionButton className="violet">Read More</ActionButton>
                      </a>
                      {_example.projectLink &&
                      <a
                        title={`Open "${_example.title}" project in Playground`}
                        href={_example.projectLink}
                        target="_blank"
                        rel="noopener"
                        onClick={() => {
                          Mixpanel.track("Open example project", {
                            link: _example.projectLink,
                            title: _example.title
                          });
                        }}
                      >
                        <ActionButton>Open Project</ActionButton>
                      </a>
                      }
                    </Buttons>
                  </Example>
                </motion.div>
            );
          })}
        </ExampleContainer>
      </Stack>
    </ExamplesContainer>
  );
};

export default Examples;
