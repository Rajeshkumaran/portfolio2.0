# Diagram IR

The generator accepts JSON with this shape:

```json
{
  "version": 1,
  "name": "checkout-flow",
  "title": "Checkout Flow",
  "family": "flowchart",
  "orientation": "TB",
  "theme": {
    "mode": "light",
    "accent": "#4f46e5",
    "background": "#ffffff",
    "font": "hand",
    "density": "comfortable",
    "roughness": 1
  },
  "nodes": [
    {
      "key": "start",
      "label": "Start checkout",
      "kind": "terminator",
      "details": ["Entry point"],
      "group": "client",
      "inferred": false
    }
  ],
  "edges": [
    {
      "key": "start-to-cart",
      "from": "start",
      "to": "cart",
      "label": "continue",
      "kind": "sync",
      "fromCardinality": "1",
      "toCardinality": "0..*",
      "inferred": false
    }
  ],
  "groups": [
    {
      "key": "client",
      "label": "Client",
      "kind": "boundary",
      "members": ["start", "cart"]
    }
  ],
  "annotations": [
    {
      "key": "note-1",
      "label": "Approved assumption",
      "target": "cart",
      "kind": "note"
    }
  ],
  "sequence": {
    "participants": [
      { "key": "browser", "label": "Browser" }
    ],
    "messages": [
      {
        "key": "request",
        "from": "browser",
        "to": "api",
        "label": "POST /checkout",
        "kind": "sync",
        "activate": true
      }
    ],
    "frames": [
      {
        "key": "retry-loop",
        "kind": "loop",
        "label": "while retryable",
        "fromMessage": "request",
        "toMessage": "response"
      }
    ]
  },
  "preserveUnmentioned": false
}
```

Supported families:

```text
architecture
sequence
flowchart
data-model
state-machine
infrastructure
concept-map
freeform
```

Keys must be stable, unique, lowercase kebab-case identifiers. They become
element-level `customData.semanticKey` values and are used to preserve identity
during revisions.

For ordinary families, use `nodes`, `edges`, `groups`, and `annotations`.
Sequence diagrams use `sequence.participants`, `sequence.messages`, and
optional `sequence.frames`; generic nodes and edges may be omitted.

Node kinds include:

```text
person system service container process decision terminator data database
entity state initial final network zone note concept external
```

An entity may include:

```json
{
  "attributes": [
    { "name": "id", "type": "uuid", "key": "PK", "optional": false },
    { "name": "account_id", "type": "uuid", "key": "FK", "optional": false }
  ]
}
```

Approved uncertain information must set `inferred: true`. The compiler renders
it with a distinct dashed style.

