export async function getRandomNames(num: number): Promise<string[]> {
  // const res = await fetch(
  //   `https://randommer.io/api/Name?nameType=firstname&quantity=${num}`,
  //   {
  //     headers: {
  //       "X-Api-Key": "YOUR_API",
  //       Accept: "*/*",
  //     },
  //   }
  // );
  // if (!res.ok) {
  //   const errorText = await res.text();
  //   throw new Error(
  //     `Failed to query randommer.io: ${res.status} - ${errorText}`
  //   );
  // }

  // return res.json();
  const names: string[] = [];
  const characters = 'abcdefghijklmnopqrstuvwxyz';

  for (let i = 0; i < num; i++) {
      const nameLength = Math.floor(Math.random() * 9) + 4; // Length between 4 and 12
      let name = characters.charAt(Math.floor(Math.random() * characters.length)).toUpperCase(); // First char uppercase

      for (let j = 1; j < nameLength; j++) {
          name += characters.charAt(Math.floor(Math.random() * characters.length)).toLowerCase(); // Other chars lowercase
      }

      names.push(name);
  }

  return names;  
}
