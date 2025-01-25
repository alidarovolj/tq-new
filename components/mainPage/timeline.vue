<script setup>

const { t } = useI18n()

const timeline = ref([
  {
    name: "mainPage.timeline.founded.name",
    description: "mainPage.timeline.founded.description",
    date: "mainPage.timeline.founded.date",
    dateTime: "2021-08",
  },
  {
    name: "mainPage.timeline.secured.name",
    description: "mainPage.timeline.secured.description",
    date: "mainPage.timeline.secured.date",
    dateTime: "2021-12",
  },
  {
    name: "mainPage.timeline.released.name",
    description: "mainPage.timeline.released.description",
    date: "mainPage.timeline.released.date",
    dateTime: "2022-02",
  },
  {
    name: "mainPage.timeline.globalLaunch.name",
    description: "mainPage.timeline.globalLaunch.description",
    date: "mainPage.timeline.globalLaunch.date",
    dateTime: "2022-12",
  },
 {
  name: "mainPage.timeline.whyChooseUs.name",
  description: "mainPage.timeline.whyChooseUs.description",
  date: "mainPage.timeline.whyChooseUs.date",
  dateTime: "2022-12",
 },
])
</script>

<template>
  <div class="bg-white py-24 sm:py-32">
    <div class="mx-auto container px-6">
      <p class="mx-auto mt-2 max-w-xl text-pretty text-center text-3xl md:text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl mb-10">
       {{ $t('mainPage.timeline.title') }}
      </p>
      <div
        class="mx-auto grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-3"
      >
        <div>
          <div class="flex items-center text-xl font-semibold leading-6 text-mainColor mb-5">
            <svg
              viewBox="0 0 4 4"
              class="mr-4 h-1 w-1 flex-none"
              aria-hidden="true"
            >
              <circle cx="2" cy="2" r="2" fill="currentColor" />
            </svg>
            {{ $t('mainPage.timeline.about.title') }}
            <div
              class="absolute -ml-2 h-px w-screen -translate-x-full bg-gray-900/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
              aria-hidden="true"/>
          </div>
         <p class="text-lg text-gray-600">
          {{ $t('mainPage.timeline.about.firstLine') }}
         </p>
         <p class="text-lg text-gray-600 mb-5">
          {{ $t('mainPage.timeline.about.secondLine') }}
         </p>
         <p class="text-lg text-gray-600 mb-5">
          {{ $t('mainPage.timeline.about.thirdLine') }}
         </p>
         <p class="text-lg text-gray-600">
          {{ $t('mainPage.timeline.about.fourthLinePrefix') }}
          <span class="font-bold">{{ $t('mainPage.timeline.companyName') }}</span>
          {{ $t('mainPage.timeline.about.fourthLinePostfix') }}
         </p>
        </div>

       <div>
        <div class="flex items-center text-xl font-semibold leading-6 text-mainColor mb-5">
         <svg
           viewBox="0 0 4 4"
           class="mr-4 h-1 w-1 flex-none"
           aria-hidden="true"
         >
          <circle cx="2" cy="2" r="2" fill="currentColor" />
         </svg>
         {{ $t('mainPage.timeline.mission.title') }}
         <div
           class="absolute -ml-2 h-px w-screen -translate-x-full bg-gray-900/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
           aria-hidden="true"/>
        </div>
        <p class="text-lg text-gray-600">
         {{ $t('mainPage.timeline.mission.firstLine') }}
        </p>
        <p class="text-lg text-gray-600 mb-5">
         {{ $t('mainPage.timeline.mission.secondLine') }}
        </p>
        <ul class="text-gray-600">
         <li>{{ $t('mainPage.timeline.mission.liFirst') }}</li>
         <li>{{ $t('mainPage.timeline.mission.liSecond') }}</li>
         <li>{{ $t('mainPage.timeline.mission.liThird') }}</li>
        </ul>
        <p class="text-lg text-gray-600 mt-5">
         {{ $t('mainPage.timeline.mission.thirdLinePrefix') }}
         <span class="font-bold">{{ $t('mainPage.timeline.mission.thirdLine') }}</span>
         {{ $t('mainPage.timeline.mission.thirdLinePostfix') }}
        </p>
       </div>

       <div>
        <div class="flex items-center text-xl font-semibold leading-6 text-mainColor mb-5">
         <svg
           viewBox="0 0 4 4"
           class="mr-4 h-1 w-1 flex-none"
           aria-hidden="true"
         >
          <circle cx="2" cy="2" r="2" fill="currentColor" />
         </svg>
         {{ $t('mainPage.timeline.advantages.title') }}
         <div
           class="absolute -ml-2 h-px w-screen -translate-x-full bg-gray-900/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
           aria-hidden="true"/>
        </div>
        <ol class="text-gray-600">
         <li><span class="font-bold">{{ $t('mainPage.timeline.advantages.liFirstSpan') }}</span> {{ $t('mainPage.timeline.advantages.liFirst') }}</li>
         <li><span class="font-bold">{{ $t('mainPage.timeline.advantages.liSecondSpan') }}</span>{{ $t('mainPage.timeline.advantages.liSecond') }}</li>
         <li><span class="font-bold">{{ $t('mainPage.timeline.advantages.liThirdSpan') }}</span>{{ $t('mainPage.timeline.advantages.liThird') }}</li>
         <li><span class="font-bold">{{ $t('mainPage.timeline.advantages.liFourthSpan') }}</span>{{ $t('mainPage.timeline.advantages.liFourth') }}</li>
        </ol>
       </div>

       <div>
        <div class="flex items-center text-xl font-semibold leading-6 text-mainColor mb-5">
         <svg
           viewBox="0 0 4 4"
           class="mr-4 h-1 w-1 flex-none"
           aria-hidden="true"
         >
          <circle cx="2" cy="2" r="2" fill="currentColor" />
         </svg>
         {{ $t('mainPage.timeline.forWhoWeWorks.title') }}
         <div
           class="absolute -ml-2 h-px w-screen -translate-x-full bg-gray-900/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
           aria-hidden="true"/>
        </div>
        <p class="text-lg text-gray-600 mb-5">
         {{ $t('mainPage.timeline.forWhoWeWorks.firstLine') }}
        </p>
        <ul class="text-gray-600">
         <li>{{ $t('mainPage.timeline.forWhoWeWorks.liFirst') }}</li>
         <li>{{ $t('mainPage.timeline.forWhoWeWorks.liSecond') }}</li>
         <li>{{ $t('mainPage.timeline.forWhoWeWorks.liThird') }}</li>
        </ul>
        <p class="text-lg text-gray-600 mt-5">
         <span class="font-bold">{{ $t('mainPage.timeline.companyName') }}</span>
         {{ $t('mainPage.timeline.forWhoWeWorks.secondLine') }}
        </p>
       </div>

       <div>
        <div class="flex items-center text-xl font-semibold leading-6 text-mainColor mb-5">
         <svg
           viewBox="0 0 4 4"
           class="mr-4 h-1 w-1 flex-none"
           aria-hidden="true"
         >
          <circle cx="2" cy="2" r="2" fill="currentColor" />
         </svg>
         {{ $t('mainPage.timeline.whyChooseUs.title') }}
         <div
           class="absolute -ml-2 h-px w-screen -translate-x-full bg-gray-900/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
           aria-hidden="true"/>
        </div>
        <p class="text-lg text-gray-600">
         {{ $t('mainPage.timeline.whyChooseUs.firstLine') }}
        </p>
        <p class="text-lg text-gray-600 mb-5">
         {{ $t('mainPage.timeline.whyChooseUs.secondLine') }}
        </p>
        <p class="text-lg text-gray-600">
         <span class="font-bold">{{ $t('mainPage.timeline.companyName') }}</span>
         {{ $t('mainPage.timeline.whyChooseUs.thirdLine') }}
        </p>
        <p class="text-lg text-gray-600">
         {{ $t('mainPage.timeline.whyChooseUs.fourthLine') }}
        </p>
       </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
ul{
 list-style: disc;
 padding-left: 20px;
 font-size:18px;
}

ol{
 list-style: -moz-arabic-indic;
 padding-left: 25px;
 font-size:18px;
}
</style>
