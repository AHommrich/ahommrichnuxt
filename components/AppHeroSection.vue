<script setup lang="ts">
import { ref, onMounted } from "vue";

const isClient = ref(false);

onMounted(() => {
  isClient.value = import.meta.client; // Setze auf true, wenn im Client
});
</script>

<template>
  <div
    id="home"
    class="mx-auto w-full max-w-full overflow-hidden sm:pb-52 pb-24 sm:pt-[200px] md:pb-[300px] md:pt-[230px] lg:pt-[270px] xl:pt-[320px]"
  >
    <div
      class="relative mx-auto hidden h-36 w-36 max-w-full rotate-45 sm:block sm:h-[600px] sm:w-[600px] md:h-[750px] md:w-[750px] lg:h-[960px] lg:w-[960px] xl:h-[1200px] xl:w-[1200px]"
    >
      <!-- Mitte -->

      <div
        class="group absolute left-1/2 top-1/3 h-12 w-12 -translate-x-1/2 overflow-hidden sm:h-[200px] sm:w-[200px] md:h-[250px] md:w-[250px] lg:h-[320px] lg:w-[320px] xl:h-[400px] xl:w-[400px]"
      >
        <div
          class="absolute inset-0 rotate-[-45deg] scale-[1.5] bg-[url('/img/electric.jpg')] bg-cover bg-center transition-transform duration-200 ease-in-out group-hover:scale-[1.75]"
        />
        <div class="absolute bottom-0 right-0 z-10 h-1/2 w-1/2 bg-[#8D1D29]">
          <div
            class="flex h-full w-full rotate-[-45deg] flex-col rounded-md p-3 text-center text-white"
          >
            <div
              class="flex h-8 w-8 rotate-45 items-center justify-center self-center border-white md:border xl:h-12 xl:w-12"
            >
              <font-awesome-icon
                v-if="isClient"
                :icon="['fas', 'bolt']"
                class="h-12 w-12 text-white rotate-[-45deg]"
              />
            </div>
            <div class="pt-3 md:pt-5 lg:pt-9">
              <p class="text-[8px] md:text-[10px] lg:text-xs xl:text-base">
                Von Elektrotechnik bis Software Entwicklung.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Oben -->

      <div
        class="group absolute left-1/2 top-0 h-12 w-12 -translate-x-1/2 overflow-hidden sm:h-[200px] sm:w-[200px] md:h-[250px] md:w-[250px] lg:h-[320px] lg:w-[320px] xl:h-[400px] xl:w-[400px]"
      >
        <div
          class="absolute inset-0 rotate-[-45deg] scale-[1.5] bg-[url('/img/php-coding.jpg')] bg-cover bg-center transition-transform duration-200 ease-in-out group-hover:scale-[1.75]"
        />

        <div class="absolute bottom-0 left-0 z-10 h-1/2 w-1/2 bg-[#8D1D29]">
          <div
            class="flex h-full w-full rotate-[-45deg] flex-col rounded-md p-3 text-center text-white"
          >
            <div
              class="flex rotate-45 items-center justify-center self-center border-white md:h-8 md:w-8 md:border xl:h-12 xl:w-12"
            >
              <font-awesome-icon
                v-if="isClient"
                :icon="['fas', 'eye']"
                class="h-12 w-12 text-white rotate-[-45deg]"
              />
            </div>
            <div class="pt-3 md:pt-5 lg:pt-9">
              <p class="text-[8px] md:text-[10px] lg:text-xs xl:text-base">
                Leidenschaftlich Lösungen finden.
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- Unten -->

      <div
        class="group absolute bottom-0 left-1/2 h-12 w-12 -translate-x-1/2 overflow-hidden sm:h-[200px] sm:w-[200px] md:h-[250px] md:w-[250px] lg:h-[320px] lg:w-[320px] xl:h-[400px] xl:w-[400px]"
      >
        <div
          class="absolute inset-0 rotate-[-45deg] scale-[1.5] bg-[url('/img/guitar-playing.jpg')] bg-cover bg-center transition-transform duration-200 ease-in-out group-hover:scale-[1.75]"
        />

        <div class="absolute right-0 top-0 z-10 h-1/2 w-1/2 bg-[#4b0b15]">
          <div
            class="flex h-full w-full rotate-[-45deg] flex-col rounded-md p-3 text-center text-white"
          >
            <div
              class="flex h-8 w-8 rotate-45 items-center justify-center self-center border-white md:border xl:h-12 xl:w-12"
            >
              <font-awesome-icon
                v-if="isClient"
                :icon="['fas', 'headphones']"
                class="h-12 w-12 text-white rotate-[-45deg]"
              />
            </div>
            <div class="pt-3 md:pt-5 lg:pt-9">
              <p class="text-[8px] md:text-[10px] lg:text-xs xl:text-base">
                Mit Musik durch den Tag.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Links -->

      <div
        class="group absolute left-0 top-1/2 h-12 w-12 -translate-y-1/2 overflow-hidden sm:h-[200px] sm:w-[200px] md:h-[250px] md:w-[250px] lg:h-[320px] lg:w-[320px] xl:h-[400px] xl:w-[400px]"
      >
        <div
          class="absolute inset-0 rotate-[-45deg] scale-[1.5] bg-[url('/img/website.jpg')] bg-cover bg-center transition-transform duration-200 ease-in-out group-hover:scale-[1.75]"
        />

        <div class="absolute right-0 top-0 z-10 h-1/2 w-1/2 bg-[#8D1D29]">
          <div
            class="flex h-full w-full rotate-[-45deg] flex-col rounded-md p-3 text-center text-white"
          >
            <div
              class="flex h-8 w-8 rotate-45 items-center justify-center self-center border-white md:border xl:h-12 xl:w-12"
            >
              <font-awesome-icon
                v-if="isClient"
                :icon="['fas', 'graduation-cap']"
                class="h-12 w-12 text-white rotate-[-45deg]"
              />
            </div>
            <div class="pt-3 md:pt-5 lg:pt-9">
              <p class="text-[8px] md:text-[10px] lg:text-xs xl:text-base">
                Mit Begeisterung Wissen teilen und dazulernen.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Rechts -->

      <div
        class="group absolute right-0 top-1/2 h-12 w-12 -translate-y-1/2 overflow-hidden sm:h-[200px] sm:w-[200px] md:h-[250px] md:w-[250px] lg:h-[320px] lg:w-[320px] xl:h-[400px] xl:w-[400px]"
      >
        <div
          class="absolute inset-0 rotate-[-45deg] scale-[1.5] bg-[url('/img/freeride-mtb.jpg')] bg-cover bg-center transition-transform duration-200 ease-in-out group-hover:scale-[1.75]"
        />

        <div class="left-0-0 absolute bottom-0 z-10 h-1/2 w-1/2 bg-[#4b0b15]">
          <div
            class="flex h-full w-full rotate-[-45deg] flex-col rounded-md p-3 text-center text-white"
          >
            <div
              class="flex h-8 w-8 rotate-45 items-center justify-center self-center border-white md:border xl:h-12 xl:w-12"
            >
              <font-awesome-icon
                v-if="isClient"
                :icon="['fas', 'person-hiking']"
                class="h-12 w-12 text-white rotate-[-45deg]"
              />
            </div>
            <div class="pt-2 md:pt-5 lg:pt-9">
              <p class="text-[8px] md:text-[10px] lg:text-xs xl:text-base">
                Freizeit auf zwei Rädern und zu Fuß.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Oben links -->
      <div
        class="group absolute left-0 top-0 h-12 w-12 overflow-hidden sm:h-[200px] sm:w-[200px] md:h-[250px] md:w-[250px] lg:h-[320px] lg:w-[320px] xl:h-[400px] xl:w-[400px]"
      >
        <div
          class="absolute inset-0 rotate-[-45deg] scale-[1.5] bg-[url('/img/andre-arbeit-2.jpg')] bg-cover bg-[center_left_-30px] transition-transform duration-200 ease-in-out group-hover:scale-[1.75]"
        />

        <div
          class="absolute bottom-0 right-0 z-10 flex h-1/2 w-1/2 items-center justify-center bg-[#4b0b15]"
        >
          <div
            class="flex h-full w-full rotate-[-45deg] flex-col rounded-md p-3 text-center text-white"
          >
            <div
              class="flex h-8 w-8 rotate-45 items-center justify-center self-center border-white md:border xl:h-12 xl:w-12"
            >
              <font-awesome-icon
                v-if="isClient"
                :icon="['fas', 'hand-peace']"
                class="h-12 w-12 text-white rotate-[-45deg]"
              />
            </div>
            <div class="pt-3 md:pt-5 lg:pt-9">
              <p class="text-sm lg:text-base xl:text-2xl">Hallo</p>
              <p class="text-[8px] md:text-[10px] lg:text-xs xl:text-base">
                Ich bin André
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Unten rechts -->

      <div
        class="group absolute bottom-0 right-0 h-12 w-12 overflow-hidden sm:h-[200px] sm:w-[200px] md:h-[250px] md:w-[250px] lg:h-[320px] lg:w-[320px] xl:h-[400px] xl:w-[400px]"
      >
        <div
          class="absolute inset-0 rotate-[-45deg] scale-[1.5] bg-[url('/img/andre.jpg')] bg-cover bg-center transition-transform duration-200 ease-in-out group-hover:scale-[1.75]"
        />
      </div>
    </div>
    <!-- mobile design -->
    <div class="sm:hidden">
      <div
        class="relative rotate-45"
        style="left: calc(47.5% - 340px); margin-bottom: -200px"
      >
        <!-- Erster Würfel -->
        <div
          class="relative -left-[200px] top-[200px] h-[200px] w-[200px] overflow-hidden"
        >
          <div
            class="absolute inset-0 rotate-[-45deg] scale-[1.5] bg-[url('/img/andre-arbeit-2.jpg')] bg-cover bg-center"
          />
          <div class="absolute bottom-0 right-0 z-10 h-1/2 w-1/2 bg-[#4b0b15]">
            <div
              class="flex h-full w-full rotate-[-45deg] flex-col rounded-md p-3 text-center text-white"
            >
              <div
                class="flex h-8 w-8 rotate-45 items-center justify-center self-center border-white md:border xl:h-12 xl:w-12"
              >
                <font-awesome-icon
                  v-if="isClient"
                  :icon="['fas', 'hand-peace']"
                  class="h-12 w-12 text-white rotate-[-45deg]"
                />
              </div>
              <div class="pt-1 md:pt-5 lg:pt-9">
                <p class="text-sm lg:text-base xl:text-2xl">Hallo</p>
                <p class="text-[8px] md:text-[10px] lg:text-xs xl:text-base">
                  Ich bin André
                </p>
              </div>
            </div>
          </div>
        </div>
        <!--Zweiter würfel-->
        <div class="relative h-[200px] w-[200px] overflow-hidden">
          <div
            class="absolute inset-0 rotate-[-45deg] scale-[1.5] bg-[url('/img/php-coding.jpg')] bg-cover bg-center"
          />
          <div class="absolute bottom-0 left-0 z-10 h-1/2 w-1/2 bg-[#8D1D29]">
            <div
              class="flex h-full w-full rotate-[-45deg] flex-col rounded-md p-3 text-center text-white"
            >
              <div
                class="flex h-8 w-8 rotate-45 items-center justify-center self-center border-white md:border xl:h-12 xl:w-12"
              >
                <font-awesome-icon
                  v-if="isClient"
                  :icon="['fas', 'eye']"
                  class="h-12 w-12 text-white rotate-[-45deg]"
                />
              </div>
              <div class="pt-3 md:pt-5 lg:pt-9">
                <p class="text-[8px] md:text-[10px] lg:text-xs xl:text-base">
                  Leidenschaftlich Lösungen finden.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- dritter Würfel -->
        <div class="relative h-[200px] w-[200px] overflow-hidden">
          <div
            class="absolute inset-0 rotate-[-45deg] scale-[1.5] bg-[url('/img/website.jpg')] bg-cover bg-center"
          />
          <div class="absolute left-0 top-0 z-10 h-1/2 w-1/2 bg-[#4b0b15]">
            <div
              class="flex h-full w-full rotate-[-45deg] flex-col rounded-md p-3 text-center text-white"
            >
              <div
                class="flex h-8 w-8 rotate-45 items-center justify-center self-center border-white md:border xl:h-12 xl:w-12"
              >
                <font-awesome-icon
                  v-if="isClient"
                  :icon="['fas', 'graduation-cap']"
                  class="h-12 w-12 text-white rotate-[-45deg]"
                />
              </div>
              <div class="pt-3 md:pt-5 lg:pt-9">
                <p class="text-[8px] md:text-[10px] lg:text-xs xl:text-base">
                  Mit Begeisterung Wissen teilen und dazulernen.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- vierter Würfel -->
        <div
          class="relative -top-[200px] left-[200px] h-[200px] w-[200px] overflow-hidden"
        >
          <div
            class="absolute inset-0 rotate-[-45deg] scale-[1.5] bg-[url('/img/electric.jpg')] bg-cover bg-center"
          />
          <div class="absolute bottom-0 right-0 z-10 h-1/2 w-1/2 bg-[#8D1D29]">
            <div
              class="flex h-full w-full rotate-[-45deg] flex-col rounded-md p-3 text-center text-white"
            >
              <div
                class="flex h-8 w-8 rotate-45 items-center justify-center self-center border-white md:border xl:h-12 xl:w-12"
              >
                <font-awesome-icon
                  v-if="isClient"
                  :icon="['fas', 'bolt']"
                  class="h-12 w-12 text-white rotate-[-45deg]"
                />
              </div>
              <div class="pt-3 md:pt-5 lg:pt-9">
                <p class="text-[8px] md:text-[10px] lg:text-xs xl:text-base">
                  Von Elektrotechnik bis Software Entwicklung.
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- fünfter Würfel -->
        <div
          class="relative -top-[200px] left-[200px] h-[200px] w-[200px] overflow-hidden"
        >
          <div
            class="absolute inset-0 rotate-[-45deg] scale-[1.5] bg-[url('/img/guitar-playing.jpg')] bg-cover bg-center"
          />
          <div class="absolute right-0 top-0 z-10 h-1/2 w-1/2 bg-[#4b0b15]">
            <div
              class="flex h-full w-full rotate-[-45deg] flex-col rounded-md p-3 text-center text-white"
            >
              <div
                class="flex h-8 w-8 rotate-45 items-center justify-center self-center border-white md:border xl:h-12 xl:w-12"
              >
                <font-awesome-icon
                  v-if="isClient"
                  :icon="['fas', 'headphones']"
                  class="h-12 w-12 text-white rotate-[-45deg]"
                />
              </div>
              <div class="pt-3 md:pt-5 lg:pt-9">
                <p class="text-[8px] md:text-[10px] lg:text-xs xl:text-base">
                  Mit Musik durch den Tag.
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- sechster Würfel -->
        <div
          class="relative -right-[400px] -top-[400px] h-[200px] w-[200px] overflow-hidden"
        >
          <div
            class="absolute inset-0 rotate-[-45deg] scale-[1.5] bg-[url('/img/freeride-mtb.jpg')] bg-cover bg-center"
          />
          <div class="absolute left-0 top-0 z-10 h-1/2 w-1/2 bg-[#8D1D29]">
            <div
              class="flex h-full w-full rotate-[-45deg] flex-col rounded-md p-3 text-center text-white"
            >
              <div
                class="flex h-8 w-8 rotate-45 items-center justify-center self-center border-white md:border xl:h-12 xl:w-12"
              >
                <font-awesome-icon
                  v-if="isClient"
                  :icon="['fas', 'person-hiking']"
                  class="h-12 w-12 text-white rotate-[-45deg]"
                />
              </div>
              <div class="pt-3 md:pt-5 lg:pt-9">
                <p class="text-[8px] md:text-[10px] lg:text-xs xl:text-base">
                  Freizeit auf zwei Rädern und zu Fuß.
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- siebter Würfel -->
        <div
          class="relative -top-[400px] left-[400px] h-[200px] w-[200px] overflow-hidden"
        >
          <div
            class="absolute inset-0 rotate-[-45deg] scale-[1.5] bg-[url('/img/andre.jpg')] bg-cover bg-center"
          />
        </div>
      </div>
    </div>
  </div>
</template>
