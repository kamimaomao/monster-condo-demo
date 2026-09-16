// Drawn from PikPok's official 2024 screenshots; no external image dependency.
const silhouettes = {
  blue: `
    <g stroke="#242579" stroke-width="3.5" stroke-linejoin="round">
      <path fill="#c5dcff" d="M58 225C11 190 5 132 27 89L18 61 46 72 43 31 72 58C82 14 111 21 122 64 145 24 161 60 148 90 185 83 186 123 158 141L179 260Z"/>
      <path fill="#f1eafd" stroke="#aeb2ed" stroke-width="2" d="M46 78Q30 145 74 188M77 56Q53 121 86 177M103 50Q82 105 104 140M133 69Q104 102 126 136"/>
      <path fill="#8299df" stroke="none" d="M28 136Q27 196 71 226L73 274 98 273 105 165Z"/>
      <path fill="#e6fcfc" d="M82 216Q61 207 51 232L41 293 52 340 38 390 66 398 94 345 108 274Z"/>
      <path fill="#aecde9" stroke="none" d="M47 277L60 309 57 342 47 388 63 390 83 343 76 277Z"/>
      <path fill="#302b96" d="M80 215L161 205 182 310 160 353 78 351 57 312Z"/>
      <path fill="#151e67" stroke="none" d="M148 220L160 303 143 337 80 342 82 353 160 353 182 310 164 216Z"/>
      <path fill="#e5faff" d="M139 329L166 340 185 392 161 401 134 355Z"/>
      <path fill="#86add9" stroke="none" d="M153 349L165 345 184 391 167 394Z"/>
      <path fill="#253885" d="M36 387L62 390 69 405 24 407ZM158 391L182 385 195 402 151 406Z"/>
      <path fill="#142379" d="M102 112L154 116 159 262 126 294 79 267 73 160Z"/>
      <path fill="#4634ab" stroke="none" d="M131 132L151 135 146 260 126 279 112 264Z"/>
      <path fill="none" stroke="#b7f2ff" stroke-width="5" d="M93 132L85 249 104 276M141 135L137 252 122 277"/>
      <path fill="#c8f4fd" d="M74 184Q44 176 36 199L27 246Q42 261 61 250L75 208Z"/>
      <path fill="#70b9e6" stroke="none" d="M35 205L34 238 48 243 66 220 62 201Z"/>
      <g class="arm"><path fill="#d6f8ff" d="M159 202Q180 181 193 207L190 250 220 272 212 293Q174 286 164 258Z"/><path fill="#71b7e1" stroke="none" d="M170 209L176 256 209 284 215 276 188 250 190 215Z"/><path fill="#b6e7f7" d="M211 268Q224 257 232 267L237 283 224 297 210 287Z"/></g>
      <path fill="#efffff" d="M81 78L77 56 91 65 115 68 129 55 140 80Q155 82 159 101L183 103 195 126 184 146 144 154 125 143 91 147 69 130 64 101Z"/>
      <path fill="#abc6de" stroke="none" d="M153 101L181 103 191 123 173 126 162 149 141 151 125 138 94 141 104 128 135 128Z"/>
      <path fill="#81cce7" d="M72 82L60 49 51 65 61 97ZM129 79L145 42 154 55 145 87Z"/>
      <path fill="#dde9fb" stroke="none" d="M62 63L68 79 70 63ZM144 56L139 72 148 58Z"/>
      <g class="eye"><ellipse fill="#fff" cx="94" cy="103" rx="17" ry="21"/><ellipse fill="#fff" cx="142" cy="98" rx="16" ry="20"/><ellipse fill="#b923a3" stroke="none" cx="101" cy="107" rx="8" ry="11"/><ellipse fill="#b923a3" stroke="none" cx="149" cy="101" rx="7" ry="11"/><circle fill="#201148" stroke="none" cx="104" cy="108" r="5"/><circle fill="#201148" stroke="none" cx="151" cy="103" r="5"/><circle fill="#fff" stroke="none" cx="100" cy="102" r="3"/><circle fill="#fff" stroke="none" cx="148" cy="97" r="3"/><path fill="none" stroke-width="2" d="M75 91L69 86M75 99L67 95M128 81L123 75"/></g>
      <path fill="#98b6d2" stroke="none" d="M177 116L184 124 177 128 172 122Z"/>
      <g class="mouth"><path fill="#f0ffff" d="M132 123Q157 127 185 122 207 140 206 173 204 219 174 226 142 225 135 188 129 162 132 123Z"/><path fill="#251255" stroke="#392878" d="M142 140Q166 148 191 135 204 163 193 199 181 217 161 204 145 183 142 140Z"/><path fill="#887dd0" stroke="none" d="M151 183Q167 169 192 181L191 199Q177 215 162 202Z"/><path fill="#fffbea" stroke="#c9d5e5" stroke-width="1.5" d="M144 140L149 157 160 160 159 145ZM161 145L164 161 175 160 175 143ZM177 142L180 157 190 151 191 136ZM160 202L161 190 171 192 175 208ZM176 208L177 193 187 188 190 200Z"/></g>
      <path fill="#cb49ac" d="M99 73L114 70 112 38 88 4Z"/>
      <path fill="#f9e65b" stroke="none" d="M95 30L109 39 108 51 100 53Z"/>
      <path fill="#73d7c2" stroke="none" d="M92 20L103 30 109 39 95 33Z"/>
      <path fill="#638de8" stroke="none" d="M88 4L101 26 94 23Z"/>
      <path fill="#fffac8" stroke="none" d="M88 4L93 15 90 13Z"/>
      <path fill="#c5ebff" stroke="none" d="M78 282L81 291 90 291 83 297 85 306 78 301 71 306 73 297 66 291 75 291ZM151 279L154 288 163 288 156 294 158 303 151 298 144 303 146 294 139 288 148 288Z"/>
      <ellipse fill="#203787" cx="119" cy="322" rx="40" ry="18"/><path fill="none" stroke="#456bc3" stroke-width="2" d="M83 318Q120 329 156 316"/>
    </g>`,
  red: `
    <g stroke="#80200d" stroke-width="3.5" stroke-linejoin="round">
      <g class="arm"><path fill="none" stroke="#fbb037" stroke-width="15" d="M66 275Q21 284 22 233L28 199"/><path fill="#f17b18" d="M31 210Q-9 200 8 157L33 170 25 187 41 176 53 153Q80 172 55 206Z"/><path fill="#a32c0d" stroke="none" d="M30 171L25 187 41 176 53 153 43 186 29 198 16 182Z"/><path fill="#ffae34" stroke="none" d="M9 175Q8 194 26 201L20 188ZM52 170L45 188 50 191 62 178Z"/></g>
      <path fill="#ce330c" d="M74 314L65 365 38 392 27 392 29 403 53 403 88 373 103 336ZM127 333L143 374 190 401 212 400 213 389 198 392 161 359 156 316Z"/>
      <path fill="#ffa628" d="M78 328L65 376 42 399 54 402 84 377 99 336ZM140 336L155 370 192 392 203 393 157 359 155 330Z" stroke="none"/>
      <path fill="#f47917" d="M64 144Q43 197 51 267L56 315Q74 351 123 354 172 349 187 310L185 203Q174 153 144 143Z"/>
      <path fill="#d8330e" stroke="none" d="M150 150Q169 205 165 283 170 326 137 347 180 340 188 308L184 206 164 161Z"/>
      <path fill="#ff9c2b" stroke="none" d="M64 200Q50 252 69 307L84 321 65 265 74 221Z"/>
      <g class="arm"><path fill="none" stroke="#ffab30" stroke-width="17" d="M174 272Q211 263 221 301"/><path fill="#f77715" d="M208 280Q233 257 240 287L232 303 224 297 230 316Q210 330 200 310Z"/><path fill="#bc320d" stroke="none" d="M240 287L232 303 224 297 230 316 218 308 213 293Z"/><path fill="#ffae30" stroke="none" d="M207 284L204 302 210 309 216 293Z"/></g>
      <path fill="#f37e18" d="M67 182L48 134 60 111 77 177ZM146 169L176 116 189 127 165 186Z"/>
      <g class="eye"><ellipse fill="#d4fbfd" cx="48" cy="132" rx="25" ry="28"/><ellipse fill="#e8ffff" cx="180" cy="134" rx="25" ry="29"/><ellipse fill="#009bd9" stroke="none" cx="57" cy="139" rx="13" ry="17"/><ellipse fill="#009bd9" stroke="none" cx="185" cy="141" rx="14" ry="18"/><ellipse fill="#102039" stroke="none" cx="61" cy="142" rx="9" ry="12"/><ellipse fill="#102039" stroke="none" cx="190" cy="144" rx="9" ry="12"/><circle fill="#fff" stroke="none" cx="55" cy="131" r="7"/><circle fill="#fff" stroke="none" cx="183" cy="132" r="7"/><path fill="#f76c14" d="M26 145Q47 129 66 153L55 167 34 163ZM164 159Q177 137 201 148L201 162 180 173Z"/><path fill="none" stroke="#a7290b" stroke-width="2" d="M34 149L56 158M177 158L194 151"/></g>
      <g class="mouth"><path fill="#fc931e" d="M79 183Q125 161 163 183 187 216 182 273 165 314 127 321 91 322 71 292 52 248 66 206Z"/><path fill="#971633" d="M86 193Q124 179 157 192 176 222 171 267 159 300 124 306 90 306 78 277 65 236 78 211Z"/><path fill="#2d1145" stroke="none" d="M93 207Q126 191 153 207 172 237 160 270 143 294 112 291 85 279 86 244Z"/><path fill="#5d8cab" stroke="none" d="M82 268Q88 239 113 246 125 230 143 242 164 235 172 261L161 288Q132 315 97 293Z"/><path fill="#89b9c9" stroke="none" d="M84 276Q87 252 109 254L103 283Q92 290 84 276ZM115 255Q125 239 142 250L144 285 118 296Q107 280 115 255Z"/><path fill="#ffe69f" stroke="#e08c24" stroke-width="1.5" d="M86 194L88 209Q96 218 103 208L104 190ZM139 188L141 202Q150 213 157 200L155 192ZM91 286Q102 274 108 294L108 301 98 297ZM147 298L147 288Q153 273 161 283L159 290Z"/></g>
      <path fill="#bebfae" d="M53 62L76 66 94 86 156 87 172 67 192 72 177 154 121 192 74 150Z"/>
      <path fill="#888f90" stroke="none" d="M121 90L157 90 174 72 187 75 174 151 124 185Z"/>
      <path fill="#e5d9b7" stroke="none" d="M58 69L73 74 90 96 108 95 110 165 80 145Z"/>
      <path fill="#778783" d="M96 84L111 56 148 52 169 70 158 86Z"/>
      <path fill="#ccd3c9" stroke="none" d="M111 61L145 57 159 70 104 76Z"/>
      <path fill="#c13c2a" d="M125 55L130 26Q144 17 155 28L149 56Z"/>
      <path fill="#3c4260" stroke="none" d="M128 39L152 41 149 54 125 54Z"/>
      <path fill="#4c6266" stroke="none" d="M111 70L118 69 116 75 109 76ZM124 68L131 67 129 73 122 74ZM138 66L145 66 143 72 136 73Z"/>
      <path fill="none" stroke="#7f8b82" stroke-width="3" d="M65 79L73 128 102 153M169 92L164 128"/>
      <path fill="#efa13e" d="M101 153L112 144 116 177 124 187 132 172 140 174 133 192 119 204 106 190Z"/>
      <path fill="none" stroke="#566b6c" stroke-width="5" d="M112 88L118 191"/>
      <circle fill="#5c6a69" stroke="none" cx="71" cy="95" r="4"/><circle fill="#77867b" stroke="none" cx="83" cy="135" r="4"/><circle fill="#687876" stroke="none" cx="155" cy="120" r="4"/>
      <path fill="#ffbb46" stroke="none" d="M64 310L76 313 83 330 76 330ZM82 324L94 327 99 340 91 338Z"/>
    </g>`,
  green: `
    <g stroke="#063e24" stroke-width="3.5" stroke-linejoin="round">
      <path fill="#0d672e" d="M57 142L18 160 37 172 10 188 49 195 29 215 68 215 156 198 211 212 202 187 229 181 199 163 212 150 175 138Z"/>
      <path fill="#1d9f31" d="M53 215Q43 250 47 292L62 342 45 388 77 400 104 350 141 352 158 397 193 392 166 335 184 277 173 217Z"/>
      <path fill="#0b6b2b" stroke="none" d="M149 222L167 266 150 327 156 354 174 394 190 390 166 335 184 277 173 221Z"/>
      <path fill="#073d21" d="M53 294L90 307 130 302 175 291 165 340 141 356 104 345 78 354 59 336Z"/>
      <path fill="none" stroke="#285d34" stroke-width="2" d="M82 321L82 341M142 320L147 345M95 312L109 329 109 343"/>
      <path fill="#f7f5d4" d="M69 207L152 205 169 227 146 268 146 303 89 313 66 290 58 238Z"/>
      <path fill="#d5dfc1" stroke="none" d="M144 212L154 229 132 265 137 301 145 301 147 267 168 228 154 211Z"/>
      <path fill="#13462b" d="M76 214L88 219 90 303 77 300ZM134 213L148 210 151 299 138 305Z"/>
      <path fill="#fffdeb" stroke-width="2" d="M82 211L109 219 102 240 79 218ZM109 219L130 210 135 229 112 240Z"/>
      <path fill="#293c24" d="M103 237L114 236 116 245 109 257 102 247Z"/><path fill="#284329" d="M107 253L111 252 117 287 109 295 102 285Z"/>
      <circle fill="#223f25" stroke="none" cx="124" cy="269" r="2"/><circle fill="#223f25" stroke="none" cx="126" cy="283" r="2"/>
      <g class="arm"><path fill="#fffce4" d="M57 224Q23 231 21 265L40 271 65 244Z"/><path fill="#2aaf32" d="M24 256Q-1 279 14 303L39 310 49 293 31 289 45 269Z"/><path fill="#10722b" stroke="none" d="M18 265L17 284 30 297 39 307 47 292 31 287 43 269Z"/><path fill="none" stroke="#158b2e" stroke-width="3" d="M18 296L22 286M28 302L32 291"/></g>
      <g class="arm"><path fill="#fffce4" d="M165 218Q199 224 208 258L192 272 169 247Z"/><path fill="#28af35" d="M197 256L214 250 229 266 231 286 214 298 198 290 193 277Z"/><path fill="#16752b" stroke="none" d="M214 259L223 272 220 284 209 290 216 295 231 284 230 266Z"/><path fill="none" stroke="#0e7d2c" stroke-width="2.5" d="M209 265L204 278M217 273L212 286"/></g>
      <path fill="#171d18" d="M43 382L70 389 79 408 21 408 25 397ZM164 388L188 381 213 400 212 408 157 408Z"/><path fill="#40563a" stroke="none" d="M26 399L55 400 69 405 25 405ZM174 396L191 390 206 401 200 404Z"/>
      <path fill="#29bb3b" d="M61 99Q80 63 117 78 163 65 181 109L189 157Q200 196 165 221 117 248 64 217 39 197 45 160Z"/>
      <path fill="#119129" stroke="none" d="M151 83Q173 111 165 158 188 190 153 224 181 216 191 197L188 157 181 109 166 90Z"/>
      <path fill="#64d549" stroke="none" d="M62 106Q45 138 56 173L67 164 77 111Z"/>
      <path fill="#1f9330" d="M77 93Q95 79 120 87 146 81 164 104L159 145 91 155 70 132Z"/>
      <g class="eye"><ellipse fill="#ffe9ec" cx="120" cy="120" rx="32" ry="39"/><path fill="#edcbd8" stroke="none" d="M119 82Q87 112 105 149 118 163 136 151 108 155 111 118 105 99 119 82Z"/><ellipse fill="#ec29a5" stroke="none" cx="133" cy="127" rx="12" ry="20"/><ellipse fill="#101b23" stroke="none" cx="138" cy="129" rx="7" ry="15"/><ellipse fill="#fff" stroke="none" cx="130" cy="119" rx="5" ry="7"/></g>
      <g class="mouth"><path fill="#197c2b" d="M59 158Q119 173 174 152 205 180 186 214 147 249 80 224 53 206 49 179Z"/><path fill="#361247" d="M58 171Q119 187 178 165 193 187 177 208 136 237 84 215 64 203 58 171Z"/><path fill="#6c58b8" stroke="none" d="M83 207Q116 180 145 211L164 220Q121 239 83 213Z"/><path fill="#a8f5ef" stroke="#cef8db" stroke-width="1" d="M62 173L81 178 74 195ZM83 178L103 182 92 199ZM106 182L126 181 115 201ZM129 180L151 175 143 194ZM154 174L175 168 173 188ZM83 214L91 197 104 225ZM108 225L119 205 131 229ZM136 228L145 208 158 221ZM159 220L168 200 178 209Z"/></g>
      <path fill="#052f20" d="M72 67L80 24 133 9 164 30 176 69 200 75Q203 93 156 100L91 90 54 83Q46 72 72 67Z"/>
      <path fill="#12622c" stroke="none" d="M88 29L132 15 156 32 154 65 83 61Z"/>
      <path fill="#4c9341" stroke="none" d="M85 34L91 31 87 56 83 55Z"/>
      <path fill="#348c3b" d="M78 56L158 63 172 77 80 70Z"/>
      <path fill="#df5590" stroke="#972a69" stroke-width="2" d="M153 68Q173 38 184 29 187 58 171 75Z"/>
      <path fill="none" stroke="#ff9fbc" stroke-width="1.5" d="M159 67L182 35M168 57L179 57M173 48L184 47"/>
    </g>`,
  yellow: `
    <g stroke="#875009" stroke-width="3.5" stroke-linejoin="round">
      <path fill="#f4b52b" d="M80 246L165 241 182 275 164 316 82 316 64 279Z"/>
      <path fill="#c47b0b" stroke="none" d="M150 247L171 277 151 302 85 307 82 316 164 316 182 275 165 241Z"/>
      <path fill="#ffdf53" d="M75 262L112 266 100 289 78 285ZM127 267L162 259 168 280 138 289Z"/>
      <path fill="#533216" d="M107 289L136 289 143 310 101 310Z"/><path fill="#ffcf35" stroke="none" d="M117 293L130 293 134 304 112 304Z"/>
      <g class="arm"><path fill="none" stroke="#bc7e0c" stroke-width="16" d="M77 270L45 255 33 216"/><path fill="none" stroke="#ffd64c" stroke-width="8" d="M77 267L50 250 39 216"/><circle fill="#ffd54b" cx="43" cy="252" r="12"/><path fill="#efb91d" d="M33 230L17 211 18 184 28 168 27 197 35 201 42 192 47 166 57 186 53 208Z"/><path fill="#fff176" stroke="none" d="M20 185L24 201 28 207 24 211 20 205ZM50 183L44 199 45 204 51 196Z"/></g>
      <g class="arm"><path fill="none" stroke="#b88212" stroke-width="17" d="M169 268L207 242 220 192"/><path fill="none" stroke="#ffdd4a" stroke-width="8" d="M172 266L202 239 217 196"/><circle fill="#ffe059" cx="204" cy="242" r="12"/><path fill="#f1bc26" d="M218 203L202 187 203 164 212 146 211 172 218 179 226 173 232 146 239 170 235 190Z"/><path fill="#fff073" stroke="none" d="M205 166L209 179 216 185 212 190 205 181ZM234 164L227 181 230 184 235 175Z"/></g>
      <path fill="#ecb42a" d="M82 311L98 315 86 350 76 383 57 383 61 350ZM147 315L164 310 177 349 188 383 168 386 151 351Z"/>
      <path fill="#66452c" d="M64 344L89 348 84 359 61 354ZM153 350L177 344 181 355 158 360Z"/>
      <path fill="#fff16b" stroke="none" d="M79 316L87 318 74 345 67 344ZM162 317L167 333 172 345 165 347 153 319Z"/>
      <path fill="#ffd03b" d="M56 375L79 382 86 398 32 405 24 397 36 384ZM166 382L188 374 212 392 216 403 164 402 156 394Z"/>
      <path fill="#976920" stroke="none" d="M30 396L77 390 83 397 35 403ZM163 392L212 398 214 401 166 400Z"/>
      <path fill="#bbdf7d" fill-opacity=".48" stroke="#edfaaf" stroke-width="5" d="M87 52Q48 78 54 159L65 237Q89 267 151 254 179 240 182 207L185 132Q184 74 147 52Z"/>
      <path fill="#d7f4b8" fill-opacity=".4" stroke="none" d="M83 66Q62 98 69 151L76 215 87 225 81 135Q77 93 95 63Z"/>
      <path fill="#8da95a" fill-opacity=".5" stroke="none" d="M159 68Q177 104 169 165L164 222Q150 248 104 249 161 258 178 223L184 131Q182 89 159 68Z"/>
      <path fill="none" stroke="#675884" stroke-width="3" d="M95 62Q116 85 94 113M131 61Q118 85 148 95M145 61Q160 85 151 108"/>
      <path fill="none" stroke="#e74d4a" stroke-width="3" d="M111 60Q127 76 114 105"/>
      <path fill="#c8892c" d="M87 190L149 186 160 229 144 240 88 236 79 219Z"/>
      <path fill="#f1c861" stroke="none" d="M106 192L129 192 137 229 117 238 100 222Z"/>
      <path fill="#4b2915" d="M75 110L60 94 57 120 72 152 92 135ZM144 108L167 92 173 126 157 149 141 131Z"/>
      <path fill="#f1c66a" d="M85 103Q107 86 135 99 164 104 168 139L162 179 136 202 102 193 73 167 72 132Z"/>
      <path fill="#d5a145" stroke="none" d="M135 101Q151 120 148 146L159 167 145 188 135 202 159 184 168 147 164 120Z"/>
      <path fill="#4a2c18" d="M79 118Q87 110 99 116L111 141 102 160 80 156 68 143ZM140 116Q155 109 164 129L167 149 151 164 137 153 129 134Z"/>
      <g class="eye"><ellipse fill="#ffd142" cx="87" cy="141" rx="23" ry="29"/><ellipse fill="#ffd142" cx="150" cy="147" rx="20" ry="27"/><ellipse fill="#201611" cx="90" cy="142" rx="17" ry="23"/><ellipse fill="#201611" cx="153" cy="147" rx="14" ry="21"/><ellipse fill="#fff" stroke="none" cx="96" cy="131" rx="7" ry="9"/><ellipse fill="#fff" stroke="none" cx="158" cy="138" rx="6" ry="8"/></g>
      <g class="mouth"><path fill="#643518" d="M99 157Q119 147 137 159L151 181 141 214Q121 234 103 214L88 189Z"/><path fill="#1e1515" stroke="none" d="M105 178Q120 167 137 176L143 190Q140 218 122 221 104 213 103 197Z"/><path fill="#ce786e" stroke="none" d="M110 211Q121 188 137 207 133 220 122 221Z"/><path fill="#fdf1b1" stroke="none" d="M106 181L112 180 114 188 108 190ZM133 179L139 182 137 190 132 187Z"/></g>
      <path fill="#332115" d="M111 153Q125 145 137 158L134 168 122 174 110 166Z"/><path fill="#fff2b4" stroke="none" d="M120 155Q128 151 134 157L130 159Z"/>
      <path fill="#fce390" stroke="none" d="M102 107Q116 100 130 107L131 112 105 115Z"/>
      <path fill="#c29548" d="M76 48Q73 16 111 13 151 13 161 45L157 58 84 64Z"/>
      <path fill="#eaca76" stroke="none" d="M81 41Q88 21 116 21 140 25 145 40L131 36 102 38Z"/>
      <path fill="none" stroke="#ad7234" stroke-width="3" d="M95 41Q91 30 103 27 115 28 109 36M135 43Q126 29 136 32 146 35 145 46"/>
      <path fill="#f6ce3a" d="M75 45L157 43 170 53 168 67 91 76 73 63Z"/>
      <path fill="#fff078" stroke="none" d="M78 49L153 48 159 53 88 60Z"/>
      <path fill="#b48b18" stroke="none" d="M88 64L161 56 162 63 91 72Z"/>
      <path fill="#d69f22" d="M65 230Q108 251 168 229L177 243Q162 264 113 267 79 264 64 247Z"/>
      <path fill="#ffe870" stroke="none" d="M67 234Q113 254 169 233L172 239Q124 262 69 243Z"/>
      <circle fill="#684c24" cx="113" cy="257" r="5"/><circle fill="#fff193" stroke="none" cx="113" cy="256" r="2"/>
    </g>`,
};

export function monsterSVG(color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 420" fill="none" aria-hidden="true">${silhouettes[color] ?? silhouettes.blue}</svg>`;
}
