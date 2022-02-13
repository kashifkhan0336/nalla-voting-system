import { useState, useRef, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  Button,
  Page,
  Text,
  Grid,
  Card,
  Spacer,
  Keyboard,
  Input,
  Toggle,
  Modal,
} from "@geist-ui/core";
import Plot from "react-plotly.js";
function useStickyState(defaultValue, key) {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}
function App() {
  const [state, setState] = useState(false);
  const handler = () => setState(true);
  const closeHandler = (event) => {
    setState(false);
    console.log("closed");
  };
  const [mqm_votes, addMQMVote] = useStickyState(0, "mqm_votes");
  const [pti_votes, addPTIVote] = useStickyState(0, "pti_votes");
  const [ppp_votes, addPPPVote] = useStickyState(0, "ppp_votes");
  const your_name = useRef(null);
  const your_age = useRef(0);
  const [inputType, setInputType] = useState("");
  useEffect(() => {
    console.log(Number(your_age) >= 18);
    document.addEventListener("keydown", (event) => {
      console.log(event);
      if (
        event.altKey &&
        (event.key == "1" || event.key == "2" || event.key == "3")
      ) {
        if (Number(your_age.current.value) >= 18) {
          switch (event.key) {
            case "2":
              console.log(your_age.current.value);
              addMQMVote((mqm_votes) => mqm_votes + 1);
              setInputType("success");
              your_age.current.value = "";
              your_name.current.value = "";
              handler();
              break;
            case "1":
              addPTIVote((pti_votes) => pti_votes + 1);
              setInputType("success");
              your_age.current.value = "";
              your_name.current.value = "";
              handler();
              break;
            case "3":
              addPPPVote((ppp_votes) => ppp_votes + 1);
              setInputType("success");
              your_age.current.value = "";
              your_name.current.value = "";
              handler();
              break;
            default:
              break;
          }
        } else {
          setInputType("error");
        }
      }
    });
  }, []);
  return (
    <div>
      <Page>
        <Modal visible={state} onClose={closeHandler}>
          <Modal.Title>Vote casted successfully</Modal.Title>
        </Modal>
        <Text h1>Cast Your Vote</Text>
        <Input placeholder="Your Name" ref={your_name} />
        <br />
        <Spacer h={1} />
        <Input placeholder="Your Age" ref={your_age} type={inputType} />
        <Spacer h={1} />
        <Parties />
        <Spacer h={4} />
        <Plot
          data={[
            {
              x: [mqm_votes, ppp_votes, pti_votes],

              y: ["MQM", "PPP", "PTI"],
              type: "bar",
              orientation: "h",
              marker: {
                color: ["#EE0000", "#000000", "#50E3C2"],
              },
            },
          ]}
          layout={{
            width: window.innerWidth,
            height: 440,
            title: "Votes Graph",
          }}
        />
      </Page>
    </div>
  );
}

const Parties = () => {
  const par = [
    {
      partyName: "PTI",
      partyColor: "cyan",
      KeyboardKey: "1",
    },
    {
      partyName: "MQM",
      partyColor: "error",
      KeyboardKey: "2",
    },
    {
      partyName: "PPP",
      partyColor: "dark",
      KeyboardKey: "3",
    },
  ];
  return (
    <Grid.Container gap={1.5}>
      {par.map((party) => (
        <Grid xs={8} key={party.partyName}>
          <Card type={party.partyColor} width="100%">
            <Text h4 my={0} style={{ textTransform: "uppercase" }}>
              {party.partyName}
            </Text>
            <Text>
              <Keyboard>{"Alt + " + party.KeyboardKey}</Keyboard>
            </Text>
          </Card>
        </Grid>
      ))}
    </Grid.Container>
  );
};
export default App;
