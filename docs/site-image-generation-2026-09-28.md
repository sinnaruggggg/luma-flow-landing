# 사이트 사진 생성 결과

생성일: 2026-09-28

## 1. 분석

첨부 요청의 5개 가상 브랜드 홈페이지용 사진 25장. 플로우덱은 이미지 생성 대상에서 제외.

## 2. 계획

내장 image_gen 도구로 사진을 한 장씩 생성하고, 지정 폴더·파일명으로 PNG 원본을 저장. 기존 자산 덮어쓰기 방지.

## 3. 구현

저장 루트: `D:\www\mypages\public\sites\`

| 파일 (저장 루트 기준) | 크기 |
|---|---|
| hangyeol-law/hero-office.png | 1536 × 1024 |
| hangyeol-law/documents.png | 1536 × 1024 |
| hangyeol-law/library.png | 1024 × 1536 |
| hangyeol-law/consult-hands.png | 1536 × 1024 |
| orda-dental/hero-lobby.png | 1536 × 1024 |
| orda-dental/consult-room.png | 1536 × 1024 |
| orda-dental/sterilization.png | 1536 × 1024 |
| orda-dental/care-hands.png | 1024 × 1536 |
| ondo-coffee/hero-roaster.png | 1536 × 1024 |
| ondo-coffee/bean-bags.png | 1536 × 1024 |
| ondo-coffee/hand-drip.png | 1024 × 1536 |
| ondo-coffee/cupping.png | 1536 × 1024 |
| ondo-coffee/storefront.png | 1536 × 1024 |
| stay-yeobaek/hero-exterior.png | 1536 × 1024 |
| stay-yeobaek/outdoor-bath.png | 1536 × 1024 |
| stay-yeobaek/room-dark.png | 1536 × 1024 |
| stay-yeobaek/details.png | 1024 × 1536 |
| stay-yeobaek/breakfast.png | 1536 × 1024 |
| movelab/hero-athlete.png | 1536 × 1024 |
| movelab/hero-mobile.png | 1024 × 1536 |
| movelab/studio.png | 1536 × 1024 |
| movelab/kettlebells.png | 1536 × 1024 |
| movelab/group-class.png | 1536 × 1024 |
| movelab/rowing.png | 1024 × 1536 |
| movelab/recovery.png | 1536 × 1024 |

기존 소스 코드와 기존 사진은 변경하지 않음. 새 사진 25장과 이 문서를 추가함. 생성 원본도 Codex generated_images 폴더에 보존.

## 4. 검증

- 25개 지정 경로의 파일 존재 및 PNG 시그니처 검사 통과.
- 가로 19장: 1536 × 1024. 세로 6장: 1024 × 1536. 전부 지정 크기 일치.
- 총 용량: 54.37 MiB, 압축·변환 전 PNG 원본.
- 생성 결과를 보며 구도, 주요 피사체, 색감, 얼굴 노출 여부를 육안 점검.
- 사이트 연결 전이므로 실제 PC·모바일 페이지의 크롭, 텍스트 겹침, 로딩 속도는 미검증.
- 코드 변경이 없어 빌드·동작 테스트는 실행하지 않음. 사용자 개별 이미지 컨펌은 미확인.

## 5. 최종 정리

요청한 사진 25장 생성·저장 완료. 후속 추천 작업:

1. WebP 또는 AVIF 변환 및 용량 최적화.
2. 각 사이트의 대응 섹션에 이미지 경로 연결.
3. 연결 후 PC·모바일에서 크롭·가독성·로딩 확인.

## 실제 생성 프롬프트

내장 도구 사용. 모든 생성에서 `transparent_background: false`, 참조 이미지 없음.

### hangyeol-law/hero-office.png

```text
Create ONE photorealistic website photograph for fictional Korean law office Hangyeol. Filename hero-office.png (do NOT put filename or any text inside image). Exact canvas 1536x1024 landscape. Evening consultation room in a Seoul high-rise, large windows with softly blurred city night lights, walnut wood table, exactly four navy leather chairs, one document folder and water glasses on table. Spacious horizontal composition with negative space. Calm trustworthy mood, navy, walnut, white palette, warm interior lighting. No people, no visible faces, no text, no logos, no watermark, no gavel, no justice statue.
```

### hangyeol-law/documents.png

```text
Use case: photorealistic-natural. Asset type: website photograph for fictional Korean brand hangyeol-law. Create ONE standalone photograph, exact canvas 1536x1024 pixels. Calm trustworthy photorealistic photo, navy walnut white tones and warm natural light. Close-up looking obliquely down onto a walnut desk, blurred illegible contract papers, fountain pen, eyeglasses, stamp case, shallow depth of field. No people. No gavel or justice statue. Constraints: no readable lettering, no logos, no watermark, no visible human faces. No collage or panels. Filename documents.png is metadata only, never draw the filename inside image.
```

### hangyeol-law/library.png

```text
Use case: photorealistic-natural. Asset type: website photograph for fictional Korean brand hangyeol-law. Create ONE standalone photograph, exact canvas 1024x1536 pixels. Calm trustworthy photorealistic photo, navy walnut white tones. A wall of dark wooden bookshelves filled with law books in an office. Book spine lettering is unreadable blurred, diagonal afternoon window light falling onto shelves. No people. No gavel or justice statue. Constraints: no readable lettering, no logos, no watermark, no visible human faces. No collage or panels. Filename library.png is metadata only, never draw the filename inside image.
```

### hangyeol-law/consult-hands.png

```text
Use case: photorealistic-natural. Asset type: website photograph for fictional Korean brand hangyeol-law. Create ONE standalone photograph, exact canvas 1536x1024 pixels. Calm trustworthy photorealistic photo, navy walnut white tones, warm reassuring lighting. Two people discussing paperwork at a consultation table, ONLY hands and sleeves visible, all faces completely outside frame. One wears navy suit sleeves, the other beige knit sleeves. Naturally anatomically correct hands. No gavel or justice statue. Constraints: no readable lettering, no logos, no watermark, no visible human faces. No collage or panels. Filename consult-hands.png is metadata only, never draw the filename inside image.
```

### orda-dental/hero-lobby.png

```text
Use case: photorealistic-natural. Asset type: website photograph for fictional Korean brand orda-dental. Create ONE standalone photograph, exact canvas 1536x1024 pixels. Bright clean calm photorealistic Korean dental reception and waiting area. White, pale sage green and light wood palette. Curved light wooden reception desk, sage green sofa, large potted plant, morning sunlight through windows. No people. Spacious composition and negative space. No frightening instruments. Constraints: no readable lettering, no logos, no watermark, no visible human faces. No collage or panels. Filename hero-lobby.png is metadata only, never draw the filename inside image.
```

### orda-dental/consult-room.png

```text
Use case: photorealistic-natural. Asset type: website photograph for fictional Korean brand orda-dental. Create ONE standalone photograph, exact canvas 1536x1024 pixels. Bright clean calm photorealistic small Korean dental consultation room. White, pale sage green, light wood tones. White table with tooth model and tablet, wall-mounted monitor showing a softly blurred panoramic dental X-ray with no interface lettering, two chairs, warm reassuring lighting. No people. No frightening instruments. Constraints: no readable lettering, no logos, no watermark, no visible human faces. No collage or panels. Filename consult-room.png is metadata only, never draw the filename inside image.
```

### orda-dental/sterilization.png

```text
Use case: photorealistic-natural. Asset type: website photograph for fictional Korean brand orda-dental. Create ONE standalone photograph, exact canvas 1536x1024 pixels. Bright clean calm photorealistic dental sterilization room. White pale sage green and light wood tones. Stainless steel shelves with neatly aligned instruments enclosed in sterilization pouches, autoclave equipment. Clean white lighting. No people, no frightening instrument close-ups. Constraints: no readable lettering, no logos, no watermark, no visible human faces. No collage or panels. Filename sterilization.png is metadata only, never draw the filename inside image.
```

### orda-dental/care-hands.png

```text
Use case: photorealistic-natural. Asset type: website photograph for fictional Korean brand orda-dental. Create ONE standalone photograph, exact canvas 1024x1536 pixels. Bright clean calm photorealistic close-up of hands in white medical coat sleeves holding and explaining a dental tooth model. Only hands and model visible, no face. Softly blurred sage green wall in background, gentle natural light, white pale sage and light wood palette. Anatomically natural hands, no frightening instruments. Constraints: no readable lettering, no logos, no watermark, no visible human faces. No collage or panels. Filename care-hands.png is metadata only, never draw the filename inside image.
```

### ondo-coffee/hero-roaster.png

```text
Use case: photorealistic-natural. Asset type: website photograph for fictional Korean brand ondo-coffee. Create ONE standalone photograph, exact canvas 1536x1024 pixels. Film-camera style photorealistic editorial magazine photo of a vintage coffee roasting machine inside a small Korean specialty roastery. Freshly roasted coffee beans rotating in cooling tray, thin haze caught in window light, brick wall, dim warm atmosphere. Warm brown cream terracotta colors and subtle film grain. No people. Constraints: no readable lettering, no logos, no watermark, no visible human faces. No collage or panels. Filename hero-roaster.png is metadata only, never draw the filename inside image.
```

### ondo-coffee/bean-bags.png

```text
Use case: photorealistic-natural. Asset type: website photograph for fictional Korean brand ondo-coffee. Create ONE standalone photograph, exact canvas 1536x1024 pixels. Film-camera style photorealistic editorial product photograph. Three kraft paper coffee bean bags standing side by side, each with a completely blank solid-colored label: cream, terracotta, olive. On linen cloth with a few scattered coffee beans beside them. Straight-on composition. Warm brown cream terracotta palette, subtle film grain. No people. Constraints: no readable lettering, no logos, no watermark, no visible human faces. No collage or panels. Filename bean-bags.png is metadata only, never draw the filename inside image.
```

### ondo-coffee/hand-drip.png

```text
Use case: photorealistic-natural. Asset type: website photograph for fictional Korean brand ondo-coffee. Create ONE standalone photograph, exact canvas 1024x1536 pixels. Film-camera style photorealistic editorial magazine photograph of hand-drip coffee brewing. Copper gooseneck kettle pouring a thin stream of water into a dripper, slight steam. Only hands and arms visible, face entirely outside frame, anatomically natural hands. Warm brown cream terracotta colors and subtle grain. Constraints: no readable lettering, no logos, no watermark, no visible human faces. No collage or panels. Filename hand-drip.png is metadata only, never draw the filename inside image.
```

### ondo-coffee/cupping.png

```text
Use case: photorealistic-natural. Asset type: website photograph for fictional Korean brand ondo-coffee. Create ONE standalone photograph, exact canvas 1536x1024 pixels. Film-camera style photorealistic editorial magazine photograph, overhead view of wooden coffee cupping table. Six small glass cups containing ground coffee and brewed coffee, cupping spoons, completely blank memo cards. Warm brown cream terracotta colors, soft natural light, subtle grain. No people. Constraints: no readable lettering, no logos, no watermark, no visible human faces. No collage or panels. Filename cupping.png is metadata only, never draw the filename inside image.
```

### ondo-coffee/storefront.png

```text
Use case: photorealistic-natural. Asset type: website photograph for fictional Korean brand ondo-coffee. Create ONE standalone photograph, exact canvas 1536x1024 pixels. Film-camera style photorealistic editorial magazine photograph of a small Korean roastery cafe exterior on an alley corner. Large wooden-framed window, warm interior lighting, small bench and potted plants beside entrance, late afternoon light. All signs blank with no lettering. Warm brown cream terracotta colors, subtle grain. No people. Constraints: no readable lettering, no logos, no watermark, no visible human faces. No collage or panels. Filename storefront.png is metadata only, never draw the filename inside image.
```

### stay-yeobaek/hero-exterior.png

```text
Use case: photorealistic-natural. Asset type: website photograph for fictional Korean brand stay-yeobaek. Create ONE standalone photograph, exact canvas 1536x1024 pixels. Cinematic photorealistic photograph of fictional private seaside stay in Namhae Korea at blue hour. Single-storey exposed concrete building with warm glowing windows, calm sea and horizon in front, low stone wall and silver grass in front of building. Wide horizontal composition. Dark luxurious atmosphere, exposed concrete dark wood stone linen, warm indirect lights contrasting blue evening sky. No people. Constraints: no readable lettering, no logos, no watermark, no visible human faces. No collage or panels. Filename hero-exterior.png is metadata only, never draw the filename inside image.
```

### stay-yeobaek/outdoor-bath.png

```text
Use case: photorealistic-natural. Asset type: website photograph for fictional Korean brand stay-yeobaek. Create ONE standalone photograph, exact canvas 1536x1024 pixels. Cinematic photorealistic photograph of private outdoor hinoki wooden soaking bath at night in a Namhae Korean seaside stay. Steam rises, dark ocean and moonlight beyond bathtub, towel and small lamp beside bath. Dark luxurious quiet atmosphere, exposed concrete dark wood stone, warm indirect lighting contrasting cool blue sky. No people. Constraints: no readable lettering, no logos, no watermark, no visible human faces. No collage or panels. Filename outdoor-bath.png is metadata only, never draw the filename inside image.
```

### stay-yeobaek/room-dark.png

```text
Use case: photorealistic-natural. Asset type: website photograph for fictional Korean brand stay-yeobaek. Create ONE standalone photograph, exact canvas 1536x1024 pixels. Cinematic photorealistic photograph of dark luxurious minimal guestroom in a Namhae Korean seaside stay. Low dark wooden bed, white linen bedding, indirect light behind wall, evening sea beyond large floor-to-ceiling window. Exposed concrete dark wood stone and linen, warm indirect light contrasting cool blue evening sky. Serene mood. No people. Constraints: no readable lettering, no logos, no watermark, no visible human faces. No collage or panels. Filename room-dark.png is metadata only, never draw the filename inside image.
```

### stay-yeobaek/details.png

```text
Use case: photorealistic-natural. Asset type: website photograph for fictional Korean brand stay-yeobaek. Create ONE standalone photograph, exact canvas 1024x1536 pixels. Cinematic photorealistic close-up of stone washbasin and brass faucet with one beam of light falling across coarse stone wall. Strong emphasis on textures, dark luxurious minimal atmosphere, exposed concrete dark wood stone and linen palette, warm light. No people. Constraints: no readable lettering, no logos, no watermark, no visible human faces. No collage or panels. Filename details.png is metadata only, never draw the filename inside image.
```

### stay-yeobaek/breakfast.png

```text
Use case: photorealistic-natural. Asset type: website photograph for fictional Korean brand stay-yeobaek. Create ONE standalone photograph, exact canvas 1536x1024 pixels. Cinematic photorealistic oblique overhead photo of Korean breakfast on a dark walnut tray beside a window in a luxury seaside stay. Multiple small ceramic bowls, rice and soup, seasonal side dishes, morning window light. Dark wood stone linen palette, subtle warm light and quiet luxurious mood. No people. Constraints: no readable lettering, no logos, no watermark, no visible human faces. No collage or panels. Filename breakfast.png is metadata only, never draw the filename inside image.
```

### movelab/hero-athlete.png

```text
Use case: photorealistic-natural. Asset type: website photograph for fictional Korean brand movelab. Create ONE standalone photograph, exact canvas 1536x1024 pixels. Dynamic photorealistic sports brand advertising photograph inside dark Korean personal training studio. Backlit silhouette of one athlete vigorously swinging battle ropes, ropes form waves with slight motion blur, vivid fluorescent lime lighting behind. Black charcoal base, strong contrast, dramatic lighting. Face completely hidden in backlit silhouette. Constraints: no readable lettering, no logos, no watermark, no visible human faces. No collage or panels. Filename hero-athlete.png is metadata only, never draw the filename inside image.
```

### movelab/hero-mobile.png

```text
Use case: photorealistic-natural. Asset type: website photograph for fictional Korean brand movelab. Create ONE standalone photograph, exact canvas 1024x1536 pixels. Dynamic photorealistic sports advertising close-up of hands and muscular arms fitting a heavy weight plate onto a barbell. Chalk dust suspended in air, dark training studio background, strong contrast, black charcoal base with fluorescent lime accent lighting. Only hands and arms, no face. Anatomically correct hands. Constraints: no readable lettering, no logos, no watermark, no visible human faces. No collage or panels. Filename hero-mobile.png is metadata only, never draw the filename inside image.
```

### movelab/studio.png

```text
Use case: photorealistic-natural. Asset type: website photograph for fictional Korean brand movelab. Create ONE standalone photograph, exact canvas 1536x1024 pixels. Dynamic photorealistic sports brand advertising interior photo of empty Korean PT studio. Black rubber floor, two squat racks, wall mirrors, ceiling linear lights, lime neon linear lighting on one wall. Black charcoal base with vivid fluorescent lime accents, strong contrast. No people. Constraints: no readable lettering, no logos, no watermark, no visible human faces. No collage or panels. Filename studio.png is metadata only, never draw the filename inside image.
```

### movelab/kettlebells.png

```text
Use case: photorealistic-natural. Asset type: website photograph for fictional Korean brand movelab. Create ONE standalone photograph, exact canvas 1536x1024 pixels. Dynamic photorealistic sports brand advertising photograph of black kettlebells of assorted weights arranged in a neat row on black rubber gym floor. Low side angle, realistic metallic sheen, dark studio and strong directional light, black charcoal palette with fluorescent lime accent lighting. Kettlebells have no written weight numerals. No people. Constraints: no readable lettering, no logos, no watermark, no visible human faces. No collage or panels. Filename kettlebells.png is metadata only, never draw the filename inside image.
```

### movelab/group-class.png

```text
Use case: photorealistic-natural. Asset type: website photograph for fictional Korean brand movelab. Create ONE standalone photograph, exact canvas 1536x1024 pixels. Dynamic photorealistic sports brand advertising photograph in a dark Korean training studio. Exactly four participants doing lunges simultaneously, seen only from behind or as backlit silhouettes, faces completely invisible. Natural anatomically correct athletic posture. Strong contrast, black charcoal base, vivid fluorescent lime accent lighting. Constraints: no readable lettering, no logos, no watermark, no visible human faces. No collage or panels. Filename group-class.png is metadata only, never draw the filename inside image.
```

### movelab/rowing.png

```text
Use case: photorealistic-natural. Asset type: website photograph for fictional Korean brand movelab. Create ONE standalone photograph, exact canvas 1024x1536 pixels. Dynamic photorealistic sports brand advertising close-up of an athlete using a rowing machine. Only legs and arms pulling the handle visible, muscle tension and sweat droplets, face entirely outside frame. Correct seated rowing biomechanics. Strong side lighting, dark background, black charcoal base with fluorescent lime accents. Constraints: no readable lettering, no logos, no watermark, no visible human faces. No collage or panels. Filename rowing.png is metadata only, never draw the filename inside image.
```

### movelab/recovery.png

```text
Use case: photorealistic-natural. Asset type: website photograph for fictional Korean brand movelab. Create ONE standalone photograph, exact canvas 1536x1024 pixels. Photorealistic sports advertising still life after a workout: foam roller, towel and plain unbranded water bottle on an exercise mat in dark Korean PT studio. Calmer lighting, restful mood, black charcoal background with subtle fluorescent lime accent light. No people. Constraints: no readable lettering, no logos, no watermark, no visible human faces. No collage or panels. Filename recovery.png is metadata only, never draw the filename inside image.
```

