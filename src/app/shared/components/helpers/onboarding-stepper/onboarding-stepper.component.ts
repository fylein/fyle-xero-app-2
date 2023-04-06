import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingState } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';


@Component({
  selector: 'app-onboarding-stepper',
  templateUrl: './onboarding-stepper.component.html',
  styleUrls: ['./onboarding-stepper.component.scss']
})
export class OnboardingStepperComponent implements OnInit {

  @Input() currentStep: string;

  isCloneSettingsActive: boolean;

  onboardingSteps: OnboardingStepper[] = [
    {
      active: false,
      completed: false,
      number: 1,
      step: 'Connect to Xero',
      icon: 'xero-connector',
      route: 'xero_connector',
      size: {
        height: '20px',
        width: '10px'
      }
    },
    {
      active: false,
      completed: false,
      number: 2,
      step: 'Export Settings',
      icon: 'export-setting',
      route: 'export_settings',
      size: {
        height: '18px',
        width: '15px'
      }
    },
    {
      active: false,
      completed: false,
      number: 3,
      step: 'Import Settings',
      icon: 'import-setting',
      route: 'import_settings',
      size: {
        height: '18px',
        width: '15px'
      }
    },
    {
      active: false,
      completed: false,
      number: 4,
      step: 'Advanced Settings',
      icon: 'advanced-setting',
      route: 'advanced_settings',
      size: {
        height: '20px',
        width: '20px'
      }
    }
  ];

  constructor(
    private router: Router,
    private workspaceService: WorkspaceService
  ) { }

  private updateActiveAndCompletedSteps(): void {
    if (this.currentStep === 'Clone Settings') {
      this.isCloneSettingsActive = true;
      this.onboardingSteps[0].completed = true;
      this.onboardingSteps = [this.onboardingSteps[0]];
      this.onboardingSteps.push(
        {
          active: true,
          completed: false,
          number: 6,
          step: 'Complete the Configurations',
          icon: 'advanced-setting',
          route: 'clone_settings',
          size: {
            height: '20px',
            width: '20px'
          }
        }
      )
    }

    this.onboardingSteps.forEach(step => {
      if (step.step === this.currentStep) {
        step.active = true;
      }
    });

    const onboardingState: OnboardingState = this.workspaceService.getOnboardingState();

    const onboardingStateStepMap = {
      [OnboardingState.CONNECTION]: 1,
      [OnboardingState.EXPORT_SETTINGS]: 2,
      [OnboardingState.IMPORT_SETTINGS]: 3,
      [OnboardingState.ADVANCED_CONFIGURATION]: 4,
      [OnboardingState.COMPLETE]: 5
    };

    for (let index = onboardingStateStepMap[onboardingState] - 1; index > 0; index--) {
      this.onboardingSteps[index - 1].completed = true;
    }
  }

  navigate(canNavigate: boolean, route: string): void {
    if (canNavigate) {
      this.router.navigate([`/workspaces/onboarding/${route}`]);
    }
  }

  ngOnInit(): void {
    this.updateActiveAndCompletedSteps();
  }

}
