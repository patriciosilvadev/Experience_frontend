<template>
  <div class="partner-home">
    <div class="partner-home__filter" 
      :class="{'partner-home__filter--index-up': searcherInModal}">
      <attendance-list-filter-partner />
      <div class="filter__searcher" :class="{'filter__searcher--modal': searcherInModal}">
        <div class="filter__content">
          <attendance-list-search
            :class="{ 'filter__input': searcherInModal }"
            @focus="searcherInModal = true"
            @blur="searcherInModal = false"
          />
        </div>
      </div>
    </div>
    <div class="partner-home__attendances">
      <code-modal
        class="partner-home__modal"
        :display="displayLoading"
      >
        <template v-slot:modal>
          <code-loading
            class="partner-home__loading"   
            range="50px"
            velocity="1x"
          />
        </template>
      </code-modal>
      <attendance-list />
    </div>
  </div>
</template>

<script>
import AttendanceListFilterPartner from '../components/AttendanceListFilterPartner'
import AttendanceList from '../components/AttendanceList'
import AttendanceListSearch from '../components/AttendanceListSearch'
import CodeLoading from '../components/base/CodeLoading'
import CodeModal from '../components/base/CodeModal'
import { mapGetters } from 'vuex'
import { NAMESPACED_AUTH, NAMESPACED_ATTENDANCE} from '../utils/alias'
export default {
  name: 'PartnerHome',
  components: {
    AttendanceListFilterPartner,
    AttendanceList,
    AttendanceListSearch,
    CodeLoading,
    CodeModal
  },
  data () {
    return {
      displayHeader: true,
      searcherInModal: false,
      message: '',
      type: '',
      TIME_MESSAGE: 10000,
    }
  },
  created () {
   /*  let healthCenter = this.userId 
    this.begin = this.getBeginDate()
    this.end = this.getEndDate()
    let params = this.params
    this.getAttendancesByHealthCenter({ url: GET_ATTENDANCES (healthCenter, this.begin, this.end, 'posto'), params })
      .then(resp => console.log(resp))
      .catch((err) => console.log({err})) */
  },
  computed: {
    displayLoading () {
      return this.statusHc == 'loading' || 
        this.statusAcc == 'loading' || 
        this.statusRg == 'loading' || 
        this.status == 'loading'
    },
    ...mapGetters(NAMESPACED_AUTH, [
      'userId'
    ]),
    ...mapGetters(NAMESPACED_ATTENDANCE, [
      'status'
    ])
  },
  methods: {
    messageError (value) {
      console.log(value)
      this.message = value.message
      this.type = value.type
       setTimeout(() => {
        this.message = ''
        this.type = ''
      }, this.TIME_MESSAGE)
    }
  }
}
</script>

<style lang="sass" scoped>
.partner-home
  display: flex
  flex-direction: column
  align-items: center
.partner-home__filter--index-up
  z-index: 5
.partner-home__filter
  position: fixed
  width: 100%
  z-index: 2
.partner-home__attendances
  margin-top: 170px
  width: 98%
  @include respond-to(handhelds)
    margin-top: 100px
  @include respond-to(medium-screens)
    margin-top: 100px
.partner-home__modal
  position: fixed
.partner-home__loading
  margin-top: 130px
.filter__searcher
  display: flex
  align-items: center
  width: 100%
  padding: 10px 10px
  height: 60px
  background-color: white
  -webkit-box-box-shadow: 0 2px 4px 1px rgba(0,0,0,0.1)
  -moz-box-shadow: 0 2px 4px 1px rgba(0,0,0,0.1)
  box-shadow: 0 2px 4px 1px rgba(0,0,0,0.1)
.filter__content
  width: 100%
  display: flex
  justify-content: space-around
  align-items: center
.searcher__arrow-back
  width: 2%
  margin-right: 10px
.searcher__arrow-back--hidden
  display: none
.searcher__arrow-back--show
  display: none
  @include respond-to(handhelds)
    display: block
.filter__searcher--modal
  @include respond-to(handhelds)
    align-items: flex-start
    overflow: auto
    margin: 0 auto
    width: 100%
    height: 100%
    position: fixed
    top: 0
    left: 0
    bottom: 0
    background-color: white
    display: flex
    justify-content: center
.filter__input
  @include respond-to(handhelds)
    width: 98%
</style>