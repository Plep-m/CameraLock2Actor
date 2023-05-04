

const id = "EVENT_CAMERA_LOCK_TO_ACTOR";
const groups = ["EVENT_GROUP_CAMERA"];
const name = "Camera Lock to Actor";

const wrap8Bit = (val) => (256 + (val % 256)) % 256;
const decOct = (dec) => wrap8Bit(dec).toString(8).padStart(3, "0");

const autoLabel = (fetchArg, input) => {
  return l10n("EVENT_CAMERA_LOCK_TO_ACTOR", {
    actor: fetchArg("actorId"),
  });
};

const fields = [
    {
        key: "actor",
        label: "Actor",
        type: "actor",
        defaultValue: "$self$",
      },
      {
        key: "player",
        label: "Player",
        type: "actor",
        defaultValue: "$self$",
      },
      {
        key: "dummy",
        label: "Dummy",
        type: "actor",
        defaultValue: "$self$",
      },
    {
        key: "speed",
        type: "cameraSpeed",
        defaultValue: 0,
    }
];

const compile = (input, helpers) => {
  const {
    cameraMoveToVariables,
    actorSetActive,
    actorGetPosition,
    temporaryEntityVariable,
    _ifVariableConst,
    _jump,
    variableSetToValue,
    getNextLabel,
    _label,
    inputScriptSet,
    inputScriptRemove,
    actorGetDirection,
    actorSetDirectionToVariable,
    actorSetposition,

  } = helpers;
  
  cameraX = temporaryEntityVariable(0);
  cameraY = temporaryEntityVariable(1);
  playerX = temporaryEntityVariable(2);
  playerY = temporaryEntityVariable(3);
  playerDirection = temporaryEntityVariable(4);
  counter = temporaryEntityVariable(5);

  roundone = getNextLabel();
  actor_at = getNextLabel();
  const endLabel = getNextLabel();

  actorSetActive(input.actor);
  actorGetPosition(cameraX, cameraY);

  _ifVariableConst(".EQ", counter, 0, roundone, 0);
   // execute the events of the false path
  _jump(actor_at); // jump to the end label (after the true path)
  

  _label(roundone);
  // set player sheet empty
  inputScriptSet(["up", "down", "left", "right"], true); // set all input to 0
  actorSetActive(input.player);
  actorGetPosition(playerX, playerY);
  actorGetDirection(playerDirection);
  actorSetActive(input.dummy);
  actorSetDirectionToVariable(playerDirection);
  actorSetposition(playerX, playerY);

  _label(actor_at);
  inputScriptRemove(["up", "down", "left", "right"]);
  _jump(endLabel);
  
  _label(endLabel);


  actorGetPosition(playerX, playerY);
  cameraMoveToVariables(input.cameraX, input.cameraY, Number(input.speed));

};

module.exports = {
  id,
  name,
  autoLabel,
  groups,
  fields,
  compile,
  waitUntilAfterInitFade: true,
};